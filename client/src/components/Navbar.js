import React from 'react'
import { Link } from 'react-router-dom'
import '../styling/navbar.css'

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" 
        style={{
            background: "#3a447a",
            color:"white",
            font:"Simplifica",
        }}
        >
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    Nomad Nest
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
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">
                                Home
                            </a>
                        </li> */}
                        {/* <li className="nav-item">
                            <a className="nav-link" href="#">
                                Link
                            </a>
                        </li> */}
                        {/* <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Dropdown
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Action
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Another action
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Something else here
                                    </a>
                                </li>
                            </ul>
                        </li> */}
                    </ul>
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
                                        src="https://source.unsplash.com/250x250?girl"
                                        alt="Profile Picture"
                                    />
                                </div>
                                {/* You can also use icon as follows: */}
                                {/*  <i class="fas fa-user"></i> */}
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <i className="fas fa-sliders-h fa-fw" /> Account
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <i className="fas fa-cog fa-fw" /> Settings
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <i className="fas fa-sign-out-alt fa-fw" /> Log Out
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export { Navbar }