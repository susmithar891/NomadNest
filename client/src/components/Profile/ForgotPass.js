import React,{useState} from 'react'
import request from '../../api/axios'

const ForgotPass = () => {
    const [email,setemail] = useState("")

    const requestPass = async(e) => {
        e.preventDefault()
        try{
            const res = await request.post('/api/forgot-pass',{email})
            console.log(res)
        }
        catch(e){
            console.log(e)
        }
    }

    return (
        <form>
            <div className="form-group">
                <label className="form-label my-auto m-2">email</label>
                <input
                    type="email"
                    className="form-control w-75 m-2"
                    placeholder='enter your registered email'
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                />                
                <button className='btn btn-primary m-2 col' onClick={requestPass}>send Password</button>
            </div>
        </form>

    )
}

export default ForgotPass