import React, { useState } from 'react'
import request from '../../api/axios'

const GeneralAccount = (props) => {
    console.log(props.userState)
    const [firstnamechange, setfirstnamechange] = useState(false)
    const [lastnamechange, setlastnamechange] = useState(false)
    const [emailchange, setemailchange] = useState(false)
    const [fname, setfirstname] = useState(props.userState.firstName)
    const [lname, setlastname] = useState(props.userState.lastName)
    const [userMail, setemail] = useState(props.userState.email)
    const [otp, setOTP] = useState("")
    const [sendotp, setsendotp] = useState(false)
    const [isVerified,setisVerified] = useState(false)

    const requestOTP = async (e) => {
        e.preventDefault()
        if(!userMail){
            return ;
        }

        try {
            const res = await request.post('/api/genOTP', { email : userMail})
            setsendotp(true)
        }
        catch (e) {
            console.log(e)
        }

    }

    const verifyOTP = async (e) => {
        e.preventDefault()
        try {
            const res = await request.post('/api/email-change', { email : userMail, otp : otp})
            props.userFunc({...props.userState , email : userMail})
            setsendotp(false)
            setisVerified(true)
            setemailchange(false)
        }
        catch (e) {
            console.log(e)
        }
    }

    const changeFname = async(e) => {
        e.preventDefault()
        if(!fname){
            return ;
        }
        try{
            const res = await request.post('/api/change-fname',{fname})
            console.log(res)
            props.userFunc({...props.userState , firstName : fname})
            setfirstnamechange(false)
        }
        catch(e){
            console.log(e)
        }
    }

    const changeLname = async(e) => {
        e.preventDefault()
        if(!lname){
            return ;
        }
        try{
            const res = await request.post('/api/change-lname',{lname})
            console.log(res)
            props.userFunc({...props.userState , lastName : lname})
            setlastnamechange(false)
        }
        catch(e){
            console.log(e)
        }
    }




    return (
        <div className="container tab-pane fade active show" id="account-general">
            <div className="d-flex m-2">
                <div className='m-1'>
                    <img
                        src="https://bootdey.com/img/Content/avatar/avatar1.png"
                        alt=""
                        className="d-block ui-w-80 rounded"
                    />
                </div>

                <div className='m-1'>
                    <label className="btn btn-outline-primary m-1">
                        Upload new photo
                        <input type="file" className="account-settings-fileinput" />
                    </label>
                    <div className="text-light small mt-1">
                        Allowed JPG, GIF or PNG. Max size of 800K
                    </div>
                </div>

            </div>
            <hr className="border-light m-0" />
            <div className="card-body">
                <div className="form-group row">
                    <label className="form-label my-auto m-2 col">firstName</label>
                    <input
                        type="text"
                        className="form-control m-2 col"
                        value={fname}
                        placeholder={props.userState.firstName}
                        disabled={!firstnamechange}
                        onChange={(e) => setfirstname(e.target.value)}
                    />
                    <button className='btn btn-primary m-2 col' onClick={() => { setfirstnamechange(true) }}>edit</button>
                    <button className='btn btn-primary m-2 col' onClick={changeFname}>Save</button>
                </div>
                <div className="form-group row">
                    <label className="form-label my-auto m-2 col">lastName</label>
                    <input
                        type="text"
                        className="form-control m-2 col"
                        placeholder={lname}
                        value={lname}
                        disabled={!lastnamechange}
                        onChange={(e) => setlastname(e.target.value)}
                    />
                    <button className='btn btn-primary m-2 col' onClick={() => { setlastnamechange(true) }}>edit</button>
                    <button className='btn btn-primary m-2 col'onClick={changeLname}>Save</button>
                </div>
                <div className="form-group row">
                    <label className="form-label my-auto m-2 col">Registered Email</label>
                    <input
                        type="text"
                        className="form-control m-2 col"
                        placeholder={props.userState.email}
                        disabled={!emailchange}
                        value={userMail}
                        onChange={(e) => setemail(e.target.value)}
                    />
                    <button className='btn btn-primary m-2 col' onClick={() => { setemailchange(true) }}>edit</button>
                    <button className='btn btn-primary m-2 col' disabled={!emailchange} onClick={requestOTP}>{!sendotp ? "verify email" : "Resend otp"}</button>
                    {sendotp &&
                        <div className='d-flex'>
                            <input type="text" id="otp" className="form-control w-75 mx-2" required onChange={(e) => { setOTP(e.target.value) }} placeholder="enter otp" />
                            <button className='btn btn-primary w-25 mx-2' onClick={verifyOTP}>Verify OTP</button>
                        </div>
                    }
                    {isVerified && <div className='text-success'>Your email is verified</div>}
                </div>
            </div>
        </div>
    )
}


export default GeneralAccount
