import React from 'react'

const Numberinput = () => {
    return (
        <div className='container'>
            <button className='inline-flex border rounded-left fx-2'>-</button>
            <input className='inline-flex w-50' type='text'/>
            <button className='inline-flex border rounded-left'>+</button>
        </div>

    )
}

export default Numberinput