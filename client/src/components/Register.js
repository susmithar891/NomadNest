import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'





const Register = () => {
	const [firstName, setFirst] = useState("")
	const [lastName, setLast] = useState("")
	const [email, setEmail] = useState("")
	const [pass, setPass] = useState("")
	const [remeb, setRememb] = useState(false)

	const handleSubmit = async(e) => {
		e.preventDefault()
		console.log("firstname : ",firstName)
		console.log("lastname : ",lastName)
		console.log("email : ",email)
		console.log("password : ",pass)
		console.log("remember me : ",remeb)

		try{
			const res = await axios.post('https://localhost:4000/api/sign-up',
			JSON.stringify({"firstname" : firstName,"lastname" : lastName,"email" : email,"password" : pass,"remember" : remeb}),
			{
				headers:{"Accept":"application/json, text/plain, /","Content-Type": "multipart/form-data"},
				withCredientials :true
			})

			console.log(res.data)
		}catch(err){
			// if(!err?.response){
			// 	setErrMsg('No Server Response')
			// }
			// else if(err.response?.status === 409){
			// 	setErrMsg('username taken')
			// }
			// else{
			// 	setErrMSg('Registration failed')
			// }
			console.log(err)
		}

	
	}


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
								<div className="form-check d-flex justify-content-center mb-4">
									<input
										className="form-check-input me-2"
										type="checkbox"
										defaultValue=""
										id="remember"
										defaultChecked=""
										onChange={() => { setRememb(prevCheck => !prevCheck) }}
									/>
									<label className="form-check-label" htmlFor="remember">
										Remember me
									</label>
								</div>
								<button type="submit" className="btn btn-primary btn-block mb-4" >
									Sign Up
								</button>
							</form>

							<div className="form-check d-flex justify-content-center mb-4">
								<div className=''>
									<span className='m-2'>
										Already have an account ?
									</span>
									<Link to='/sign-in'>Sign In</Link>
								</div>
							</div>





							<div className="text-center">
								<p>or sign up with:</p>
								<button type="button" className="btn btn-link btn-floating mx-1">
									<i className="fab fa-facebook-f" />
								</button>
								<button type="button" className="btn btn-link btn-floating mx-1">
									<i className="fab fa-google" />
								</button>
								<button type="button" className="btn btn-link btn-floating mx-1">
									<i className="fab fa-twitter" />
								</button>
								<button type="button" className="btn btn-link btn-floating mx-1">
									<i className="fab fa-github" />
								</button>
							</div>

						</div>
					</div>
				</div>
			</div>
		</section>

	)
}

export default Register