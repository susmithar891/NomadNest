import React from 'react'
// import '../styling/roompage.css'

const InputBox = (props) => {

    const dec = () => {
        props.state > 0 && props.stateFunc(props.state-1)
    }



    return (
        <div className='col d-flex '>
            <label className='d-flex align-items-center m-4'>
                {props.label}
            </label>
            <div className="input-group">
                <button className='incre-btn' type="button" onClick={dec}>−</button>
                <input type="text" className="form-control text-center" value={props.state} />
                <button className='incre-btn' type="button" onClick={() => {props.stateFunc(props.state+1)}}>+</button>
            </div>
        </div>
    )
}

export default InputBox