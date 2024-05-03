import React, { useEffect, useState } from 'react'
import request from '../../api/axios'
import ReserveCard from './ReserveCard';

const ReserveInfo = (props) => {

    const [reservings, setReservings] = useState([]);


    useEffect(() => {
        request.post(`/api/user/${props.userState._id}/reservings`)
            .then((res) => {
                console.log(res.data)
                setReservings(res.data)
            })
            .catch((e) => {
                console.log(e)
            })
    }, [])


    return (

        <div className="container" id="account-info">
            {reservings.map((reser) => {
                return <ReserveCard reserve={reser} reservings={reservings} reserveFunc={setReservings} userState={props.userState} userFunc={props.userFunc} key={reser._id} />
            })}


        </div>

    )
}

export default ReserveInfo