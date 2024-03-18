import React from 'react'
import { useParams } from 'react-router-dom'
import hotels from '../media/input.json'
import { Navbar } from './Navbar'
import '../styling/roompage.css'
import RatingBar from './RatingBar'


const Roompage = (props) => {
	let params = useParams()
	let hotel = hotels.find(obj => obj.hotelId.toString() === params.id)
	const maxRating = Math.max(...Object.values(hotel.rating).filter((key,val) => key !== 'avg_rat' && typeof(val) === 'number'));
	return (
		<>
			<Navbar />

			<div className="container mt-5">
				<div className="card">
					<div className="row no-gutters">
						<div className="col-lg-6">
							<img src={require('../media/hotel' + hotel.hotelId + '.jpeg')} className="card-img" alt="Oceanview Resort" />
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


			{/* <div className="container my-5">
				<div className="row">
					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								Ratings
							</div>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">Average Rating: {hotel.rating.avg_rat}</li>
								{Object.entries(hotel.rating).filter(([key]) => key !== 'avg_rat').map(([key, value]) => (
									<li className="list-group-item">Rating {key}: {value} stars</li>
								))}
							</ul>
						</div>
					</div>
					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								Comments
							</div>
							<ul className="list-group list-group-flush">
								{hotel.comments.map((comment, index) => (
									<li className="list-group-item" key={index}>{comment}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div> */}

			<div className="container my-5">
				<div className="row">
					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								Ratings
							</div>
							<div className="card-body">
								<h6 className="card-title">Average Rating: {hotel.rating.avg_rat}</h6>
								{Object.entries(hotel.rating).filter(([key]) => key !== 'avg_rat').map(([key, value]) => (
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
								{hotel.comments.map((comment, index) => (
									<li className="list-group-item d-flex align-items-center" key={index}>
										<img src="path-to-default-profile-pic.jpg" alt="User" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />
										<div>
											<strong>User Name</strong> {/* Replace 'User Name' with dynamic data if available */}
											<p>{comment}</p>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>


				</div>
			</div>
		</>
	)
}

export default Roompage