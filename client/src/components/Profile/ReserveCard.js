import React from 'react'
import CommentModel from '../CommentModel'

const ReserveCard = (props) => {
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

                        <button type="button" className="btn btn-warning container m-2 " disabled="">
                            Verify
                        </button>
                    }
                    {/* {props.reserve.isPaid && */}

                        <button type="button" className="btn btn-success container m-2 " disabled="">
                            Pay
                        </button>

                        <CommentModel/>


                    {/* } */}
                </div>

            </div>

        </div>
    )
}

export default ReserveCard