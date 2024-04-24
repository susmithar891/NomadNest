import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import Roomcard from './Roomcard'
import request from '../api/axios'
import MultiRangeSlider from "multi-range-slider-react";
// import MultiRangeSlider from "multi-range-slider-react";


export const Homepage = () => {

    const locations = ["New York", "London", "Tokyo", "Paris", "Los Angeles", "Berlin", "Sydney", "Rome", "Toronto", "Moscow", "Singapore", "Dubai"];


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
    const [user, setUser] = useState();
    const [locFilter, setlocFilter] = useState("");
    // const [locations, setLocations] = useState([]);
    const [isfetching, setIsFetching] = useState(true);
    const [isChanging, setisChanging] = useState(false);
    const [pageCount, setpageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [minPrice, setminPrice] = useState(0);
    const [maxPrice, setmaxPrice] = useState(60000);
    const sliderRef = useRef(null)



    const handleChange = (e) => {
        // console.log(minPrice , " ",maxPrice)
        // setisChanging(false)
        // getData(locFilter, 1)

        let mini = sliderRef.current.children[0].children[1].value
        let maxi = sliderRef.current.children[0].children[4].value

        getData(locFilter, 1, mini, maxi)
    };


    useEffect(() => {
        request.post(`/api/home/OnloadData/?page=${0}`, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => {
                console.log(res)
                setData(res.data.data)
                setUser(res.data.username)
                setpageCount(res.data.pageCount)
                setIsFetching(false)
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);


    const select_val_change = (e, pageIndex) => {
        const val = e.target.value
        console.log(`value : ${val}`)
        getData(val, pageIndex, minPrice, maxPrice)
    }


    const getData = async (location, pageIndex, min_price, max_price) => {
        try {
            const res = await request.post(`/api/home/data?location=${location}&minPrice=${min_price}&maxPrice=${max_price}&page=${pageIndex}`, {
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
                <div className="">
                    <div className='mx-1 p-1'>Location</div>
                    <select className="form-select p-3 max-height-30 overflow-auto" required value={locFilter} onChange={(e) => select_val_change(e, 1)}>
                        <option className="m-2" value="" >all</option>
                        {locations.map((loc, index) => {
                            return <option className="m-2" value={loc} key={index}>{loc}</option>
                        })}

                    </select>
                </div>
            </div>

            {isfetching ?
                <div className='w-75 container d-flex justify-content-center align-items-center' style={{height : 400+'px'}}>
                    <div className="spinner-border" role="status">
                        <div className ="sr-only">Loading...</div>
                    </div>
                </div>
                : <div className='w-75 mx-auto p-3'>

                    {data.map(function (element,index) {
                        return (
                            <Link
                                className='m-3'
                                to={'/home/' + element._id}
                                key={index}
                                style={{ textDecoration: 'none' }}
                            >
                                <Roomcard hotel={element} key={index} />
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
                                <a className="page-link" onClick={() => getData(locFilter, page - 1, minPrice, maxPrice)} tabIndex="-1">Previous</a>
                            </li>
                            {[...Array(pageCount)].map((_, index) => (
                                <li className={`pointer page-item ${index + 1 === page ? 'active' : ''}`} key={index}>
                                    <a className="page-link" onClick={() => getData(locFilter, index + 1, minPrice, maxPrice)}>{index + 1}</a>
                                </li>
                            ))}
                            <li className={`page-item ${page >= pageCount ? 'disabled' : 'cursor-pointer'}`}>
                                <a className="page-link" onClick={() => getData(locFilter, page + 1, minPrice, maxPrice)}>Next</a>
                            </li>
                        </ul>
                    </nav>
                )
            }




        </>
    )
}