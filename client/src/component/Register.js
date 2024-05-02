import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import request from '../api/axios'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';




const Register = () => {

	const navigate = useNavigate()
	const location = useLocation()

	console.log(location.state.navigateUrl)

	const [firstName, setFirst] = useState("")
	const [lastName, setLast] = useState("")
	const [email, setEmail] = useState("")
	const [pass, setPass] = useState("")
	const [otp, setOTP] = useState("")
	const [sendotp, setsendotp] = useState(false)
	const [isVerified, setVerified] = useState(false)

	const requestOTP = async (e) => {
		e.preventDefault()
		
		try{
			const res = await request.post('/api/genOTP',{email})
			setsendotp(true)
		}
		catch(e){
			console.log(e)
		}

	}
	const verifyOTP = async (e) => {
		e.preventDefault()
		try{
			const res = await request.post('/api/verifyOTP',{email,otp})
			setVerified(true)
		}
		catch(e){
			console.log(e)
		}
	}



	const login = useGoogleLogin({
		onSuccess: tokenResponse => console.log(tokenResponse),
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {

			const response = await request.post("/api/sign-up", { firstname: firstName, lastname: lastName, email: email, password: pass });
			console.log(response.data)
			if (response.data && response.data.msg) {
				if (location.state && location.state.navigateUrl) {
					navigate(location.state.navigateUrl)
				}
				else {
					navigate('/home')
				}
			}
			if (response.data.redirect && response.data.redirect === "home") {
				navigate('/home')
			}
		} catch (error) {
			console.error("Error creating post:", error);
		}

	}

	useEffect(() => {

		const checkToken = async () => {

			try {
				const res = await request.post('/api/check')
				if (res.data.redirect === "home") {
					navigate('/home')
				}
			}
			catch (e) {
				alert(e)
			}

		}

		checkToken()
	}, [])


	return (
		<section className="text-center ">
			<div
				className="p-5 bg-image"
				style={{
					background: "#3a447a",
					color: "white",
					font: "Simplifica",
					height: 300
				}}
			>
				<Link className="mx-auto my-0 text-uppercase h1 text-decoration-none" to="/">Nomad Nest</Link>
			</div>
			<div
				className="card mx-4 mx-md-5 shadow-5-strong"
				style={{
					marginTop: "-100px",
					background: "hsla(0, 0%, 100%, 0.8)",
					backdropFilter: "blur(30px)"
				}}
			>
				<div className="card-body py-5 px-md-5">

					<div className="row d-flex justify-content-center">

						<div className="col-lg-8">
							<h2 className="fw-bold mb-5">Sign up</h2>
							<form onSubmit={handleSubmit}>
								<div className="row">
									<div className="col-md-6 mb-4">
										<div className="form-outline">
											<input
												type="text"
												id="firstname"
												className="form-control mx-2 p-3"
												required
												onChange={(e) => { setFirst(e.target.value) }}
											/>
											<label className="form-label" htmlFor="firstname">
												First name
											</label>
										</div>
									</div>
									<div className="col-md-6 mb-4">
										<div className="form-outline">
											<input
												type="text"
												id="lastname"
												className="form-control mx-2 p-3"
												onChange={(e) => { setLast(e.target.value) }}
												required
											/>
											<label className="form-label" htmlFor="lastname">
												Last name
											</label>
										</div>
									</div>
								</div>
								{isVerified ? 
								<div className='text-success'>Your email is verified</div> : <div className='text-danger'>verify your email to finish signing in</div>
								}
								
								<div className="form-outline mb-4">
									<div className='d-flex mb-1'>
										<input type="email" id="email" className="form-control w-75 mx-2" required onChange={(e) => { setEmail(e.target.value) }} />
										<button className='btn btn-primary w-25 mx-2' onClick={requestOTP}>{!sendotp ? "Verify Email" : "Resend OTP"}</button>
									</div>
									<div className='w-75 mx-2'>
										<label className="form-label mb-4" htmlFor="email">
											Email address
										</label>
									</div>

									{sendotp &&
											<div className='d-flex'>
												<input type="text" id="otp" className="form-control w-75 mx-2" required onChange={(e) => { setOTP(e.target.value) }} placeholder="enter otp" />
												<button className='btn btn-primary w-25 mx-2' onClick={verifyOTP}>Verify OTP</button>
											</div>
									}
								</div>
								<div className="form-outline mb-4">
									<input
										type="password"
										id="password"
										className="form-control mx-2 p-3"
										onChange={(e) => { setPass(e.target.value) }}
										required
									/>
									<label className="form-label" htmlFor="password">
										Password
									</label>
								</div>
								<div className='mb-4'>
									<button type="submit" className="btn btn-primary btn-block mb-4" >
										Sign Up
									</button>
									<div className='d-flex justify-content-center'>
										<GoogleOAuthProvider clientId="261497187757-vom1lr1cbsr68nn53b5318sdflkp028r.apps.googleusercontent.com">
											<GoogleLogin className="btn btn-link btn-floating mx-1 p-2"
												onSuccess={async (credentialResponse) => {
													try {
														const response = await request.post('api/google/sign-in', { credentialResponse })
														if (response.data === "OK") {
															if (location.state && location.state.navigateUrl) {
																navigate(location.state.navigateUrl)
															}
															else {
																navigate('/home')
															}
														}
														if (response.data.redirect && response.data.redirect === "home") {
															navigate('/home')
														}
													}
													catch (e) {
														console.log(e)
													}

												}}
												onError={() => {
													console.log('Login Failed');
												}}
											/>
										</GoogleOAuthProvider>
									</div>
								</div>
								<div className="form-check d-flex justify-content-center mb-4">
									<div className=''>
										<span className='m-2'>
											Already have an account ?
										</span>
										<Link to='/sign-in' state={{ navigateUrl: (location.state && location.state.navigateUrl) ? location.state.navigateUrl : "/home" }}>Sign In</Link>
									</div>
								</div>
							</form>


						</div>
					</div>
				</div>
			</div>
		</section>

	)
}

export default Register