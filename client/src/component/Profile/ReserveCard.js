import React from 'react'
import request from '../../api/axios'
import CommentModel from './CommentModel'
import { useNavigate } from 'react-router-dom'

const ReserveCard = (props) => {
    const navigate = useNavigate()
    let inDate = new Date(props.reserve.inDate)
    inDate.setDate(inDate.getDate() - 1)
    let outDate = new Date(props.reserve.outDate)
    outDate.setDate(outDate.getDate() - 1)

    const handlePayment = async (e, reserveId) => {
        e.preventDefault()
        try {
            console.log(reserveId)
            const res = await request.post(`api/user/payment`, { reserveId: reserveId })
            console.log(res)
            if(res.data.sessionUrl){
                
                window.open(res.data.sessionUrl,"_blank")
            }
        }
        catch (e) {
            console.log(e)
        }

    }

    const handleVerification = (e) => {
        e.preventDefault()
    }

    const handleCancel = async (e) => {
        e.preventDefault()
        try {
            const res = await request.post('/api/reserving/cancel', { reserveId: props.reserve._id })
            console.log(res)

        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div className="card m-2">
            <div className="card-body d-flex">
                <div className='container'>
                    <h5 className="card-title">Hotel Booking Details</h5>
                    <p className="card-text">Hotel Name: {props.reserve.hotelName}</p>
                    <p className="card-text">Check-in Date: {props.reserve.inDate}</p>
                    <p className="card-text">Check-out Date: {props.reserve.outDate}</p>
                    <p className="card-text">Adults: {props.reserve.adults}</p>
                    <p className="card-text">Children: {props.reserve.children}</p>
                    <p className="card-text">Price: ${props.reserve.price}</p>
                </div>
                {!props.reserve.isCancelled ?
                    <div className='container w-50 my-auto'>
                        {/* {!props.reserve.isVerified &&
                            <button type="button" className="btn btn-info container m-2 " onClick={handleVerification}>
                                Verify
                            </button>
                        } */}
                        {new Date(Date.now()) < inDate && <button className='btn btn-warning container m-2' onClick={handleCancel}>Cancel</button>}
                        <button type="button" className="btn btn-success container m-2 " onClick={(e) => handlePayment(e, props.reserve._id)}>
                            Pay
                        </button>
                        {new Date(Date.now()) > inDate && <CommentModel reserveId={props.reserve._id} />}                    
                    </div> : 
                    <div className='container w-50 my-auto'>
                        <button disabled className='btn btn-outline container m-2' style={{color : "red"}}>Cancelled</button>
                    </div>
                }


            </div>

        </div>
    )
}

export default ReserveCard