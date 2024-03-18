import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'
import Roomcard from './Roomcard'
import hotels from '../media/input.json'


export const Homepage = () => {
    return (
        <>
            <Navbar />
            
            <div className=' my-3 w-75 mx-auto'>
                <h2 className='px-4 w-75 my-3'>
                    Search for rooms.....
                </h2>
                <form className="d-flex bd-highlight m-3 justify-content">
                    <div className="w-50 m-1">
                        <select className="form-select p-3" required>
                            {/* <option  hidden>Location</option> */}
                            <option className="m-2" value="1">One</option>
                            <option className="m-2" value="2">Two</option>
                            <option className="m-2" value="3">Three</option>
                        </select>
                    </div>
                    <div className="w-50 m-1" id="prefill">
                        <input id="startDate" className="form-control p-3" type="date" required/>
                    </div>
                    <div className="w-50 m-1" id="prefill">
                        <input id="endDate" className="form-control p-3" type="date" placeholder='check-out' required/>
                    </div>
                    <div className="w-50 my-auto p-2 border border-secondary-subtle rounded-1">
                        <ul className="list-unstyled  my-auto p-2 profile-menu">
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle rounded-circle"
                                    href="#"
                                    id="navbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    2 Adults - 1 Child - 1 Room
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <div className='bd-highlight m-3 justify-content'>
                                        <div className='d-flex'>
                                            <div className="mx-2 d-flex">
                                                <p className='my-auto'>Adults :  </p>
                                            </div>
                                            <div className='d-flex w-50 mx-2 my-1 justify-content'>
                                                <button className='rounded mx-1' style={{ background: '#66ccff' }}>-</button>
                                                <input type='text' className='form-control' required/>
                                                <button className='rounded mx-1' style={{ background: '#66ccff' }}>+</button>
                                            </div>
                                        </div>
                                        <div className='d-flex'>
                                            <div className="mx-2 d-flex">
                                                <p className='my-auto'>Childs :  </p>
                                            </div>
                                            <div className='d-flex w-50 mx-2 my-1 justify-content'>
                                                <button className='rounded mx-1' style={{ background: '#66ccff' }}>-</button>
                                                <input type='text' className='form-control' required/>
                                                <button className='rounded mx-1' style={{ background: '#66ccff' }}>+</button>
                                            </div>
                                        </div>
                                        <div className='d-flex'>
                                            <div className="mx-1 d-flex">
                                                <p className='m-1 my-auto'>Rooms :  </p>
                                            </div>
                                            <div className='d-flex w-50 mx-2 my-1 justify-content'>
                                                <button className='rounded mx-1' style={{ background: '#66ccff' }}>-</button>
                                                <input type='text' className='form-control' required/>
                                                <button className='rounded mx-1' style={{ background: '#66ccff' }}>+</button>
                                            </div>
                                        </div>
                                    </div>

                                </ul>
                            </li>
                        </ul>
                    </div>

                    <button type="submit" className="btn btn-primary w-33 m-1">Search</button>
                </form>
            </div>


            {/* place,in - out dates,member count,search */}
            {/* browse by property type -- hotels,aprt,resorts,vilas ,cabins */}



            <div className='w-75 mx-auto p-3'>

                {hotels.map(function (element) {
                    return (
                        <Link className='m-3' to = {'/home/'+element.hotelId} key={element.hotelId} style={{ textDecoration: 'none' }}>
                            <Roomcard hotelId={element.hotelId} hotelName={element.hotelname} hotelimg={'hotel'+element.hotelId+'.jpeg'} hotelpre={element.preview}/>
                        </Link>
                    );
                })}
                               


            </div>
        </>
    )
}
