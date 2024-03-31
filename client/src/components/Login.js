import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import request from '../api/axios'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


const Login = () => {

	const navigate = useNavigate()

	const [email, setEmail] = useState("")
	const [pass, setPass] = useState("")
	const [remember, Setremember] = useState(false)


	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await request.post("/sign-in", { email: email, password: pass, remember: remember });

			if (response.data === "OK") {
				navigate('/home')
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
								</div>
								{/* <div className="form-check d-flex justify-content-center mb-4">
									<input
										className="form-check-input me-2"
										type="checkbox"
										defaultValue=""
										id="remember"
										defaultChecked=""
										onChange={() => Setremember(preVal => !preVal)}
									/>
									<label className="form-check-label" htmlFor="remember">
										Remember me
									</label>
								</div> */}
								<div>
									<button type="submit" className="btn btn-primary btn-block mb-4">
										Sign In
									</button>
									<div>
										<GoogleOAuthProvider clientId="<your_client_id>">
												<GoogleLogin className="btn btn-link btn-floating mx-1"
													onSuccess={credentialResponse => {
														console.log(credentialResponse);
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
										<Link to='/sign-up'>Sign up</Link>
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


export default Login