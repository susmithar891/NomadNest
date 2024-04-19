import React from 'react'
import request from '../../api/axios'
import CommentModel from './CommentModel'
import { useNavigate } from 'react-router-dom'

const ReserveCard = (props) => {
    const navigate = useNavigate()
    const handlePayment = async(e,reserveId) => {
        e.preventDefault()
        try{
            const res = await request.post(`api/user/${props.userState._id}/payment`,{reserveId : reserveId})
            console.log(res)
            if(res.statusText === "OK"){
                window.location = res.data.sessionUrl
            }
        }
        catch(e){
            console.log(e)
        }

    }

    const handleVerification = (e) => {
        e.preventDefault()
    }
    return (
        <div className="card m-2">
            <div className="card-body d-flex">
                <div className='container'>
                    <h5 className="card-title">Hotel Booking Details</h5>
                    <p className="card-text">Hotel ID: {props.reserve.hotelId}</p>
                    <p className="card-text">Check-in Date: {props.reserve.inDate}</p>
                    <p className="card-text">Check-out Date: {props.reserve.outDate}</p>
                    <p className="card-text">Adults: {props.reserve.adults}</p>
                    <p className="card-text">Children: {props.reserve.children}</p>
                    <p className="card-text">Price: ${props.reserve.price}</p>
                </div>

                <div className='container w-50 my-auto'>

                    {!props.reserve.isVerified &&

                        <button type="button" className="btn btn-warning container m-2 " onClick={handleVerification}>
                            Verify
                        </button>
                    }
                    {/* {props.reserve.isPaid && */}

                        <button type="button" className="btn btn-success container m-2 " onClick={(e) => handlePayment(e,props.reserve._id,props.reserve.reservedRoomIds,props.reserve.hotelId)}>
                            Pay
                        </button>

                        <CommentModel reserveId={props.reserve._id}/>


                    {/* } */}
                </div>

            </div>

        </div>
    )
}

export default ReserveCard