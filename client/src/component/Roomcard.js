
import React from 'react'



const Roomcard = (props) => {
    return (

        <div className="card">
            <div className="card-img-top d-flex align-items-center bg-light">
                <div className='w-50'>
                    <img className="img-fluid rounded" src={props.hotel.images[0]} alt="hotel preview" />
                </div>
                <div className="mx-3 card-body">
                    <h5 className="card-title">{props.hotel.hotelName}</h5>

                    <div className='d-flex'>
                        <div className='m-1'>
                            Location : 
                        </div>
                        <div className='m-1'>{props.hotel.location}</div>
                    </div>
                    
                    <div className='d-flex'>
                        <div className='m-1'>
                            Amenities : 
                        </div>
                        {props.hotel.amenities.map((ame, index) => {
                            return (
                                <div className='m-1' key={index}>{ame}</div>
                            )
                        })}
                    </div>

                    <div className='d-flex'>
                        <div className='m-1'>Starting price : </div>
                        <div className='m-1'>${props.hotel.minPrice/100}</div>
                    </div>

                    <div className='d-flex'>
                        <div className='m-1'>Contacts : </div>
                        {props.hotel.contactInfo.phone.map((num,index) => {
                            return (
                                <div className='m-1' key={index}>{num.countryCode} {num.phoneNumber}</div>
                            )
                        })}
                    </div>

                    <div className='d-flex'>
                        <div className='m-1'>Mail us at : </div>
                        <div className='m-1'>{props.hotel.contactInfo.email}</div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Roomcard
