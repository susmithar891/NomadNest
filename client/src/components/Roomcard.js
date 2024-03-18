import React from 'react'



const Roomcard = (props) => {
    return (
        
        <div className="card">
            <div className="card-img-top d-flex align-items-center bg-light">
                <div >
                    <img className="img-fluid rounded" src={require(`../media/${props.hotelimg}`)} alt="hotel preview" />
                </div>
                <div className="mx-3 card-body">
                    <h5 className="card-title">{props.hotelName}</h5>
                    <p className="card-text">{props.hotelpre}</p>
                </div>
            </div>
        </div>
    )
}

export default Roomcard