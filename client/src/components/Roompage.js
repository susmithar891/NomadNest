import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import hotels from '../media/input.json'
import { Navbar } from './Navbar'
import '../styling/roompage.css'
import RatingBar from './RatingBar'
import request from '../api/axios'


const Roompage = (props) => {
	// const location = useLocation()
	const params = useParams()
	const hotelModel = {
		"_id": "", // String
		"hotelName": "", // String
		"location": "", // String
		"mapsLocation": {
			"latitude": 0, // Number
			"longitude": 0 // Number
		},
		"images": [], // Array of strings
		"ratings": {
			"1": 0, // Number
			"2": 0, // Number
			"3": 0, // Number
			"4": 0, // Number
			"5": 0 // Number
		},
		"roomTypes": [], // Array of strings
		"amenities": [], // Array of strings
		"contactInfo": {
			"phone": [
				{
					"countryCode": "", // String
					"phoneNumber": "" // String
				},
				{
					"countryCode": "", // String
					"phoneNumber": "" // String
				}
			],
			"email": "" // String
		},
		"minPrice": 0, // Number
		"MaxPrice": 0 // Number
	}

	const [hotel, setHotel] = useState(hotelModel)
	const [maxRating, setmaxRating] = useState(0)

	useEffect(() => {
		request.post(`/api/hotel/${params.id}`, {
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => {
				console.log(res.data)
				hotelModel._id = res.data.data._id;
				hotelModel.hotelName = res.data.data.hotelName;
				hotelModel.location = res.data.data.location;
				hotelModel.mapsLocation = res.data.data.mapsLocation;
				hotelModel.images = res.data.data.images;
				hotelModel.ratings = res.data.data.ratings;
				hotelModel.roomTypes = res.data.data.roomTypes;
				hotelModel.amenities = res.data.data.amenities;
				hotelModel.contactInfo = res.data.data.contactInfo;
				hotelModel.minPrice = res.data.data.minPrice;
				hotelModel.MaxPrice = res.data.data.MaxPrice;
				console.log(hotel)
				const maxRat = Math.max(...Object.values(hotel.ratings).map(Number));
				console.log(maxRat)
				setmaxRating(maxRat + Math.ceil(maxRat*30/100))
				console.log(maxRating)

			})
			.catch((err) => {
				console.log(err);
			})
	}, []);




	return (
		<>
			<Navbar/>
		
			<div className="container mt-5">
				<div className="card">
					<div className="row no-gutters">
						<div className="col-lg-6">
							<img src={require('../media/hotel2.jpeg')} className="card-img" alt="Oceanview Resort" />
						</div>
						<div className="col-lg-6">
							<div className="card-body">
								<h3 className="card-title my-3">{hotel.hotelname}</h3>
								<div className="card">
									<div className="card-body">
										<h5 className="card-title">Book Your Stay</h5>
										<form>
											<div className="row align-items-center">

												<div className="col">
													<label className=''>Adults</label>
													<div className="input-group">
														<button className='incre-btn' type="button">−</button>
														<input type="text text-center" className="form-control" value="2" />
														<button className='incre-btn' type="button">+</button>
													</div>
												</div>

												<div className="col">
													<label>Children</label>
													<div className="input-group">
														<button className='incre-btn' type="button">−</button>
														<input type="text" className="form-control" value="0" />
														<button className='incre-btn' type="button">+</button>
													</div>
												</div>

												<div className="col">
													<label>Rooms</label>
													<div className="input-group">
														<button className='incre-btn' type="button">−</button>
														<input type="text" className="form-control" value="1" />
														<button className='incre-btn' type="button">+</button>
													</div>
												</div>
											</div>

											<div className="row mt-3">
												<div className="col">
													<label htmlFor="inputCheckIn">Check-In</label>
													<input type="date" className="form-control" id="inputCheckIn" />
												</div>
												<div className="col">
													<label htmlFor="inputCheckOut">Check-Out</label>
													<input type="date" className="form-control" id="inputCheckOut" />
												</div>
												<button type="submit" className="btn btn-primary mt-3">Book Room</button>
											</div>


										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container my-5">
				<div className="row">
					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								Ratings
							</div>
							<div className="card-body">
								{Object.entries(hotel.ratings).map(([key, value]) => (
									<div key={key} className="mb-2">
										<div className="text-muted">Rating {key}: </div>
										<RatingBar rating={value} maxRating={maxRating} />
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								Comments
							</div>
							<ul className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>

							</ul>
						</div>
					</div>


				</div>
			</div>
		</>
	)
}

export default Roompage