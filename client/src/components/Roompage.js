import React from 'react'
import { useParams } from 'react-router-dom'
import hotels from '../media/input.json'


const Roompage = (props) => {
  let params = useParams()
  let hotel = hotels.find(obj => obj.hotelId.toString() === params.id)
  return (
    <>
      <div>RoomId : {params.id}</div>
    <div>{hotel.hotelname}</div>
    <div><img src={require('../media/hotel'+hotel.hotelId+'.jpeg')} alt='Hotel room preview'/></div>
    {/* <div>booking options</div>
    <div>Near by places</div>
    <div>facilities (opt)</div> */}
    <div>Avergae Rating : {hotel.rating.avg_rat}</div>
    {hotel.comments.map(function(comment){
      <div>comment</div>
    })}
    {/* <div>footer (at last)</div> */}
    </>
  )
}

export default Roompage