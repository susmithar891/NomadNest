import React from 'react'

const InputBox = (props) => {

    const dec = () => {
        props.state > 0 && props.stateFunc(props.state-1)
    }



    return (
        <div className='d-flex m-2'>
            <label className='d-flex align-items-center m-4'>
                {props.label}
            </label>
            <div className="input-group d-flex">
                <button className='btn btn-info' type="button" style={{zIndex : 0}}onClick={dec}>−</button>
                <input type="text" className="form-control text-center" value={props.state} readOnly={true}/>
                <button className='btn btn-info' type="button" style={{zIndex : 0}} onClick={() => {props.stateFunc(props.state+1)}}>+</button>
            </div>
        </div>
    )
}

export default InputBox