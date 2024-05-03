import React from 'react'
import request from '../../api/axios'
import CommentModel from './CommentModel'
import { useNavigate } from 'react-router-dom'
import VerifyUser from './VerifyUser'


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
            if (res.data.sessionUrl) {
                props.reserveFunc(props.reservings.map(item => {
                    if (item._id === props.reserve._id) {
                        return { ...item, isPaid: true };
                    }
                    return item;
                }));
                window.open(res.data.sessionUrl, "_blank")
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
            props.reserveFunc(props.reservings.map(item => {
                if (item._id === props.reserve._id) {
                    return { ...item, isCancelled: true };
                }
                return item;
            }));

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
                        {new Date(Date.now()) < inDate && (!props.reserve.isVerified ? (
                            <VerifyUser reserveId={props.reserve._id} reservings={props.reservings} reserveFunc={props.reserveFunc} />
                        ) : (
                            <button type="button" className="btn btn-warning container m-2" disabled>Verified</button>
                        ))}

                        {new Date(Date.now()) < inDate && <button className='btn container m-2' style={{backgroundColor : "red" , color : "white"}}onClick={handleCancel}>Cancel</button>}
                        {!props.reserve.isPaid ?
                            <button type="button" className="btn btn-primary container m-2" onClick={(e) => handlePayment(e, props.reserve._id)}>
                                Pay
                            </button> :
                            <button type="button" className="btn btn-warning container m-2" disabled>Paid</button>
                        }

                        {new Date(Date.now()) > inDate && <CommentModel reserveId={props.reserve._id} />}
                    </div> :
                    <div className='container w-50 my-auto'>
                        <button disabled className='btn btn-outline container m-2' style={{ color: "red" }}>Cancelled</button>
                    </div>
                }


            </div>

        </div>
    )
}

export default ReserveCard