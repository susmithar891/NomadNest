import React from 'react'
import request from '../../api/axios'
import CommentModel from './CommentModel'

const ReserveCard = (props) => {
    const handlePayment = async(e,reserveId) => {
        e.preventDefault()
        try{
            const res = await request.post(`api/user/${props.userState._id}/payment`,{reserveId : reserveId})
            console.log(res)
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
                    <p className="card-text">Hotel Name: {props.reserve.hotelName}</p>
                    <p className="card-text">Check-in Date: {props.reserve.inDate}</p>
                    <p className="card-text">Check-out Date: {props.reserve.outDate}</p>
                    {/* <p className="card-text">Check-in Date: {Date(props.reserve.inDate).toLocaleString('en-US',{timeZone : 'UTC'}).split("GMT")[0].trim()}</p>
                    <p className="card-text">Check-out Date: {Date(props.reserve.outDate).toLocaleString('en-US',{timeZone : 'UTC'}).split("GMT")[0].trim()}</p> */}
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

                        <button type="button" className="btn btn-success container m-2 " onClick={(e) => handlePayment(e,props.reserve.id)}>
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