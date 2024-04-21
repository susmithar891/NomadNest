import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const ChangePass = () => {

    const [prevPass,setprevPass] = useState("")
    const [newPass,setnewPass] = useState("")
    const [newPass2,setnewPass2] = useState("")

    const changePass = async(e) => {
        e.preventDefault()
        if(newPass !== newPass2){
            alert("passwords doesn't match")
        }
        try{
            const res = await Request.post('/api/change-pass',{prevPass,newPass,newPass2})
            console.log(res)
        }
        catch(e){
            console.log(e)
        }
    }
    
    return (

        // <div className="tab-pane fade active show py-2" id="account-change-password">
        <form>
            <div className="card-body pb-2">
                <div className="form-group">
                    <label className="form-label">Current password</label>
                    <input type="password" className="form-control" required value={prevPass} onChange={(e) => {setprevPass(e.target.value)}}/>
                </div>
                <div className="form-group">
                    <label className="form-label">New password</label>
                    <input type="password" className="form-control" required value={newPass} onChange={(e) => {setnewPass(e.target.value)}}/>
                </div>
                <div className="form-group">
                    <label className="form-label">Repeat new password</label>
                    <input type="password" className="form-control" required value={newPass2} onChange={(e) => {setnewPass2(e.target.value)}}/>
                </div>
                <div className='m-1'>
                    <Link>Forgot password</Link>
                </div>
            </div>

            <div className="d-flex justify-content-end m-1 p-2">
                <button type="submit" className="btn btn-primary m-1">
                    Save changes
                </button>
            </div>
        
        </form>

    )
}

export default ChangePass