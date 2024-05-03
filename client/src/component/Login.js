import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import request from '../api/axios'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


const Login = () => {

	const navigate = useNavigate()
	const location = useLocation()

	

	const [email, setEmail] = useState("")
	const [pass, setPass] = useState("")
	const [remember, Setremember] = useState(false)
	const [regEmail, setregEmail] = useState("")
	const [sendotp, setsendotp] = useState(false)
	const [otp,setotp] = useState("")
	const [isVerified,setisVerified] = useState(false)
	const [password,setpassword] = useState("")


	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await request.post("/api/sign-in", { email: email, password: pass, remember: remember });

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

	const sendOTP = async (e) => {
		e.preventDefault()
		setotp("")
		setpassword("")
		setisVerified(false)
		try{
			const res = await request.post('/api/forgotpass/sendotp',{email : regEmail})
			setsendotp(true)

		}catch(e){
			console.log(e)
		}
		
	}

	const changePassword = async(e) => {
		e.preventDefault()
		try{
			const res = await request.post('/api/forgotpass/verifyotp',{email : regEmail,otp,password})
			setisVerified(true)
			setsendotp(false)
			setregEmail("")
			setotp("")
			setpassword("")
		}catch(e){
			console.log(e)
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
		<section className="text-center">
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
			{location.search && location.search === '?forgot-password' ?
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
								<h2 className="fw-bold mb-3">Forgot Password</h2>
								{isVerified && <div className="container mt-2 mb-3" style={{color : "green"}}>Your password has been changed</div>}
								<form>
									<div className="row">
										<label className="col my-auto w-25" htmlFor="regemail">Email address</label>
										<input type="email" id="regemail" className="form-control m-2 col" value={regEmail} required onChange={(e) => { setregEmail(e.target.value) }} />
										<button type='submit' className='btn btn-primary col' onClick={sendOTP}>{!sendotp ? "SendOTP" : "ResendOTP"} </button>
									</div>
									
								</form>
								{sendotp &&
									<form className='mt-2'>
										<div className='row'>
											<label className="col w-25 my-auto" htmlFor="email">
												Enter OTP
											</label>
											<input type="text"  className="form-control m-2 col" required value={otp} onChange={(e) => { setotp(e.target.value) }}  />
											{/* <button type='submit' className='btn btn-primary text-nowrap col' onClick={verifyOTP}>verify OTP</button> */}
										</div>
										<div className='row'>
											<label className="col my-auto w-25" htmlFor="email">
												Enter new password
											</label>
											<input type="password"  className="form-control m-2 col" value={password} required onChange={(e) => { setpassword(e.target.value) }}  />
										
									</div>
									<button type='submit' className='btn btn-primary col text-nowrap' onClick={changePassword}>verify OTP</button>
									</form>
								}
							</div>
						</div>
					</div>
				</div>
				:
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
							<h2 className="fw-bold mb-5">Sign In</h2>
							<form onSubmit={handleSubmit}>

								<div className="form-outline mb-4">
									<input type="email" id="email" className="form-control" required onChange={(e) => { setEmail(e.target.value) }} />
									<label className="form-label" htmlFor="email">
										Email address
									</label>
								</div>
								<div className="form-outline mb-4">
									<input
										type="password"
										id="password"
										className="form-control"
										required
										onChange={(e) => { setPass(e.target.value) }}
									/>
									<label className="form-label" htmlFor="password">
										Password
									</label>
										<div>
											<Link to="?forgot-password" target={"_blank"}>forgot password ?</Link>
										</div>
									</div>
									<div>
										<button type="submit" className="btn btn-primary btn-block mb-4">
											Sign In
										</button>
										<div className='d-flex justify-content-center'>
											<GoogleOAuthProvider clientId="818963098694-uc2tind3all4ecjbvchc2nt9o6gj90jq.apps.googleusercontent.com">
												<GoogleLogin className="btn btn-link btn-floating mx-1"
													onSuccess={credentialResponse => {
														request.post('api/google/sign-in',{credentialResponse})
														.then((response) => {
															if(response && response.data){
																if (location.state && location.state.navigateUrl) {
																	navigate(location.state.navigateUrl)
																}
																else{
																	navigate('/home')
																}
															}
															
														})
														.catch((e)=>{
															console.log(e)
														})
													}}
													onError={() => {
														console.log('Login Failed');
													}}
													/>
										</GoogleOAuthProvider>
									</div>
								</div>

								<div className="form-check d-flex justify-content-center m-4">
									<div className=''>
										<span className='m-2'>
											Create new account
										</span>
										<Link to='/sign-up' state={{navigateUrl : (location.state && location.state.navigateUrl) ?location.state.navigateUrl : "/home"  }}>Sign up</Link>
									</div>
								</div>




							</form>
						</div>
					</div>
				</div>
				</div>}
		</section>

	)
}


export default Login