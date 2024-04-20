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
	const [remeb, setRememb] = useState(false)


	const login = useGoogleLogin({
		onSuccess: tokenResponse => console.log(tokenResponse),
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {

			const response = await request.post("/api/sign-up", { firstname: firstName, lastname: lastName, email: email, password: pass, remember: remeb });
			console.log(response.data)
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
		} catch (error) {
			console.error("Error creating post:", error);
		}

	}

	useEffect(() => {

		const checkToken = async () => {

			try {
				const res = await request.post('/api/check')
				// if(res.data.redirect === "home"){
				//     navigate('/home')
				// }
				console.log(res)
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
												className="form-control"
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
												className="form-control"
												onChange={(e) => { setLast(e.target.value) }}
												required
											/>
											<label className="form-label" htmlFor="lastname">
												Last name
											</label>
										</div>
									</div>
								</div>
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
												onSuccess={credentialResponse => {
													request.post('api/google/sign-in',{credentialResponse})
													.then((data) => {
														console.log(data)
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