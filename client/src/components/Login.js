import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <section className="text-center">
      <div
        className="p-5 bg-image"
        style={{
          background: "#3a447a",
          color:"white",
          font:"Simplifica",
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
              <form>
                {/* <div className="form-outline mb-4">
                  <input type="email" id="form3Example3" className="form-control" />
                  <label className="form-label" htmlFor="form3Example3">
                    Email address
                  </label>
                </div> */}
                <div className="form-outline mb-4">
                  <input type="email" id="form3Example3" className="form-control" />
                  <label className="form-label" htmlFor="form3Example3">
                    Email address
                  </label>
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="form3Example4"
                    className="form-control"
                  />
                  <label className="form-label" htmlFor="form3Example4">
                    Password
                  </label>
                </div>
                <div className="form-check d-flex justify-content-center mb-4">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    defaultValue=""
                    id="form2Example33"
                    defaultChecked=""
                  />
                  <label className="form-check-label" htmlFor="form2Example33">
                    Remember me
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-block mb-4">
                  Sign In
                </button>

                <div className="form-check d-flex justify-content-center mb-4">
                  <div className=''>
                    <span className='m-2'>
                      Create new account
                    </span>
                    <Link to='/sign-up'>Sign up</Link>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}


export default Login