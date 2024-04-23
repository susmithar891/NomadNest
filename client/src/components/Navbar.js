import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styling/navbar.module.css'
import request from '../api/axios'
import PropTypes from 'prop-types'


const Navbar = (props) => {
    // console.log(`props.user.profilePic : `,props.user.profilePic)
    // console.log(props.user.profilePic)


    return (
        <nav className="navbar navbar-expand-lg navbar-dark"
            style={{
                background: "#3a447a",
                color: "white",
                font: "Simplifica",
            }}
        >
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    NomadNest
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {props.profile ?
                        props.user ?
                            <ul className="navbar-nav ms-auto mb-0 mb-lg-0 profile-menu">

                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle rounded-circle"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <div className="profile-pic">
                                            <img
                                                src={props.user.profilePic}
                                                className='rounded-circle'
                                                style={{
                                                    height : 60+"px",
                                                    width : 60+"px"
                                                }}
                                                alt="Profile Picture"
                                            />
                                        </div>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/home/profile">
                                                <i className="fas fa-sliders-h fa-fw" /> Account
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" onClick={props.logout}>
                                                <i className="fas fa-sign-out-alt fa-fw" /> Log Out
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            : <ul className="navbar-nav ms-auto mb-0 mb-lg-0 profile-menu">
                                <li className="nav-item dropdown m-3">
                                    <Link to="/sign-up" state={{navigateUrl : props.navigateTo}} className="dropdown-item">Sign Up</Link>
                                </li>
                                <li className="nav-item dropdown m-3">
                                    <Link to="/sign-in" state={{navigateUrl : props.navigateTo}} className="dropdown-item">Sign In</Link>
                                </li>

                            </ul> : <></>}

                </div>
            </div>
        </nav>
    )
}


Navbar.propTypes = {
    profile: PropTypes.bool,
    user: PropTypes.object,
    logout: PropTypes.func,
    navigateTo: PropTypes.string,
}


Navbar.defaultProps = {
    profile: true,
    navigateTo: "/home"
};

export { Navbar }