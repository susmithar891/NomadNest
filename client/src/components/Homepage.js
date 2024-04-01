import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import Roomcard from './Roomcard'
import request from '../api/axios'



export const Homepage = () => {

    const logout = async () => {
        request.post('/api/logout')
            .then(() => {
                setUser(null)
                console.log(user)
            })
            .catch((err) => {
                console.log(err)
            })


    }

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [user, setUser] = useState({});
    const [locFilter, setlocFilter] = useState("");
    const [locations, setLocations] = useState([]);
    const [isfetching, setIsFetching] = useState(true);
    const [pageCount, setpageCount] = useState(0);
    const [page, setPage] = useState(1);


    useEffect(() => {
        request.post(`/api/home/OnloadData/?page=${1}`, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => {
                console.log(res.data)
                setData(res.data.data)
                setUser(res.data.username)
                setLocations(res.data.locations)
                setpageCount(res.data.pageCount)
                setIsFetching(false)
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);


    const select_val_change = (e,pageIndex) => {
        const val = e.target.value
        console.log(`value : ${val}`)
        getData(val,pageIndex)
    }



    const getData = async (location,pageIndex) => {    
        try {
            const res = await request.post(`/api/home/data?location=${location}&page=${pageIndex}`, {
                headers: { 'Content-Type': 'application/json' },
            })

            console.log(res.data)
            setlocFilter(res.data.location)
            setData(res.data.data)
            setpageCount(res.data.pageCount)
            setPage(pageIndex)
            console.log(locFilter)
        }
        catch (e) {
            console.log(e)
        }

    }


    return (
        <>
            <Navbar profile={true} user={user} logout={logout} />

            <div className=' my-3 w-75 mx-auto'>
                <h2 className='px-4 w-75 my-3'>
                    Search for rooms.....
                </h2>
                <form className="d-flex bd-highlight m-3 justify-content">  
                    <div className="w-50 m-1">
                        <select className="form-select p-3 max-height-30 overflow-auto" defaultValue="" required onChange={(e)=>select_val_change(e,1)}>
                            <option className="m-2" disabled selected>Select</option>
                            {locations.map((loc, index) => {
                                return <option className="m-2" value={loc} key={index}>{loc}</option>
                            })}

                        </select>
                    </div>
                    <div className="w-50 m-1" id="prefill">
                        <input id="startDate" className="form-control p-3" type="date" required />
                    </div>
                    <div className="w-50 m-1" id="prefill">
                        <input id="endDate" className="form-control p-3" type="date" placeholder='check-out' required />
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
                                                <input type='text' className='form-control' required />
                                                <button className='rounded mx-1' style={{ background: '#66ccff' }}>+</button>
                                            </div>
                                        </div>
                                        <div className='d-flex'>
                                            <div className="mx-2 d-flex">
                                                <p className='my-auto'>Childs :  </p>
                                            </div>
                                            <div className='d-flex w-50 mx-2 my-1 justify-content'>
                                                <button className='rounded mx-1' style={{ background: '#66ccff' }}>-</button>
                                                <input type='text' className='form-control' required />
                                                <button className='rounded mx-1' style={{ background: '#66ccff' }}>+</button>
                                            </div>
                                        </div>
                                        <div className='d-flex'>
                                            <div className="mx-1 d-flex">
                                                <p className='m-1 my-auto'>Rooms :  </p>
                                            </div>
                                            <div className='d-flex w-50 mx-2 my-1 justify-content'>
                                                <button className='rounded mx-1' style={{ background: '#66ccff' }}>-</button>
                                                <input type='text' className='form-control' required />
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

            {isfetching ? <div>Loading Data..</div> : <div className='w-75 mx-auto p-3'>

                {data.map(function (element) {
                    return (
                        <Link className='m-3' to={'/home/' + element.hotelId} key={element.hotelId} style={{ textDecoration: 'none' }}>
                            <Roomcard hotelId={element.hotelId} hotelName={element.hotelname} hotelimg={'hotel' + element.hotelId + '.jpeg'} hotelpre={element.preview} />
                        </Link>
                    );
                })}



            </div>}
            {
                pageCount <= 1 ? (
                    <></>
                ) : (
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${page <= 1 ? 'disabled' : 'cursor-pointer'}`}>
                                <a className="page-link" onClick={() => getData(locFilter,page-1)} tabIndex="-1">Previous</a>
                            </li>
                            {[...Array(pageCount)].map((_, index) => (
                                <li className={`pointer page-item ${index + 1 === page ? 'active' : ''}`} key={index}>
                                    <a className="page-link" onClick={() => getData(locFilter,index+1)}>{index + 1}</a>
                                </li>
                            ))}
                            <li className={`page-item ${page >= pageCount ? 'disabled' : 'cursor-pointer'}`}>
                                <a className="page-link" onClick={() => getData(locFilter,page+1)}>Next</a>
                            </li>
                        </ul>
                    </nav>
                )
            }




        </>
    )
}
