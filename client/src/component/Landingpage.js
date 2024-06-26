import React, { useEffect } from 'react'
import { Routes,Link, Route, useNavigate } from 'react-router-dom'
import Login from './Login';
import Register from './Register';
import '../styles.css'
import request from '../api/axios';

const Landingpage = () => {
    const navigate = useNavigate()

    useEffect(() => {

        const checkToken = async() => {
            

            try{
                const res = await request.post('/api/check')
                if(res.data.redirect === "home"){
                    navigate('/home')
                }
            }
            catch(e){
                alert(e)
            }

        }
        checkToken()


    },[])



    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                <div className="container px-4 px-lg-5">
                    <Link className="navbar-brand" to='/'>
                        NomadNest
                    </Link>
                    <button
                        className="navbar-toggler navbar-toggler-right"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarResponsive"
                        aria-controls="navbarResponsive"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        Menu
                        <i className="fas fa-bars" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to='/sign-up' state={{navigateTo : "/home"}} className="nav-link">
                                    Register
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/sign-in' state={{navigateTo : "/home"}} className="nav-link">
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/contact-us' className="nav-link">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <header className="masthead">
                <div className="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
                    <div className="d-flex justify-content-center">
                        <div className="text-center">
                            <h1 className="mx-auto my-0 text-uppercase">Nomad Nest</h1>
                            <h2 className="text-white-50 mx-auto mt-2 mb-5">

                            </h2>
                            <Link className="btn btn-primary" to="home">
                                Start booking
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Landingpage