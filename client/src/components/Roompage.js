import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import hotels from '../media/input.json'
import { Navbar } from './Navbar'
import '../styling/roompage.css'
import RatingBar from './RatingBar'
import request from '../api/axios'
import InputBox from './InputBox'


const Roompage = (props) => {
	// const location = useLocation()
	const logout = async () => {
		request.post('/api/logout')
			.then(() => {
				setUser(null)
				console.log(user)
			})
			.catch((err) => {
				console.log(err)
			})
	}

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
	const [comments, setComments] = useState([])
	const [hotel, setHotel] = useState(hotelModel)
	const [user, setUser] = useState({})
	const [maxRating, setmaxRating] = useState(0)
	const [roomType, setroomType] = useState([])
	const [adultsCount, setadultsCount] = useState(0);
	const [childCount, setchildCount] = useState(0)
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [roomCount, setroomCount] = useState([]);
	const [checkedAval, setCheckedAval] = useState(false)
	const [maxAdult, setmaxAdult] = useState(0)
	const [maxChild, setmaxChild] = useState(0)
	const [totalPrice,settotalPrice] = useState(0)

	const handleDateChange = (range) => {
		const [startDate, endDate] = range;
		setStartDate(startDate);
		setEndDate(endDate);
		setCheckedAval(false)
		setroomCount(roomCount => roomCount.map((rc) => {
			return 0
		}))
		settotalPrice(0)
		setmaxAdult(0)
		setmaxChild(0)
	};

	const handleRoomcountChange = (e, index, inc, maxVal) => {
		e.preventDefault()
		if (inc) {
			if (roomCount[index] < maxVal) {
				roomCount[index] += 1
				setroomCount([...roomCount])
				settotalPrice(totalPrice => totalPrice+roomType[index].price)
				setmaxAdult(maxAdult => maxAdult + roomType[index].capacity.adult)
				setmaxChild(maxChild => maxChild + roomType[index].capacity.child)
			}
		}
		else {
			if (roomCount[index] > 0) {
				roomCount[index] -= 1
				setroomCount([...roomCount])
				settotalPrice(totalPrice => totalPrice-roomType[index].price)
				setmaxAdult(maxAdult => maxAdult - roomType[index].capacity.adult)
				setmaxChild(maxChild => maxChild - roomType[index].capacity.child)
			}
		}
	}

	const getonloadData = () => {
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
				const maxRat = Math.max(...Object.values(hotel.ratings).map(Number));
				setmaxRating(maxRat + Math.ceil(maxRat * 30 / 100))
				setUser(res.data.username)
				let roomtypesData = res.data.roomtypes.map((ele) => {
					return { ...ele, "rooms": [] }
				})
				setroomType(roomtypesData)
				let len = res.data.roomtypes.length;
				const rc = [];
				for (let i = 0; i < len; i++) {
					rc.push(0);
				}
				setroomCount([...rc])
			})
			.catch((err) => {
				console.log(err);
			})
	}

	useEffect(() => {
		getonloadData()
	}, []);


	const getData = async () => {
		request.post(`/api/data`, { hotelId: params.id, inDate: startDate, outDate: endDate })
			.then((res) => {
				setroomType(roomType => roomType.map((rt) => {
					if (res.data[rt.roomType]) {
						rt.rooms = res.data[rt.roomType]
					}
					console.log(rt)
					return rt
				}))
				setCheckedAval(true)
			})

			.catch((err) => {
				console.log(err)
			})
	}

	const handleCheck = async (e) => {
		e.preventDefault()
		if (!startDate || !endDate) {
			alert('Pick in and out dates to check avaliablity of rooms')
			return
		}
		getData()
	}

	const reserveRooms = async (e) => {
		e.preventDefault()
		if (!user) {
			alert("sign In / sing up to continue")
			return
		}
		if (!checkedAval) {
			alert("input in and out date")
			return
		}
		if (adultsCount > maxAdult || childCount > maxChild) {
			alert("Numberof People excedds max Capacity")
			return
		}

		let reserve = {}
		for (let i = 0; i < roomType.length; i++) {
			if (roomCount[i] !== 0) {
				reserve[roomType[i].roomType] = roomCount[i]
			}
		}
		try {
			if (reserve && Object.keys(reserve).length > 0) {
				const res = await request.post(`/api/${params.id}/reserve`, {
					reserve,
					inDate: startDate,
					outDate: endDate,
					totalAdult: adultsCount,
					totalChild: childCount
				});
				if (res) {
					if (window.confirm(`${res.data.reserved_rooms.length} rooms were reserved fro your arrival 
				Procced for payment`)) {
						console.log("taking to payments")
					}
					else {
						console.log("pay later")
					}
					console.log(res.data)
					getonloadData()
					setStartDate(null)
					setEndDate(null)
					setCheckedAval(false)
					setroomCount(roomCount => roomCount.map((rc) => {
						return 0
					}))
					settotalPrice(0)
					setmaxAdult(0)
					setmaxChild(0)
				}
			}
			else{
				alert("Add Rooms to reserve")
			}


		}
		catch (e) {
			console.log(e)
		}


	}


	return (
		<>
			<Navbar profile={true} user={user} logout={logout} navigateTo={`/home/${params.id}`}/>

			<div className="container my-1 mb-3">
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
										<h5 className="card-title">Reserve Your Stay</h5>
										<form>
											<div className="row align-items-center">
												<InputBox label="Adults" state={adultsCount} stateFunc={setadultsCount} />
												<InputBox label="Childs" state={childCount} stateFunc={setchildCount} />
											</div>

											<div className="row mt-3">
												<div className='mx-auto w-75'>
													<label className='m-3'>Pick In and Out Dates</label>
													<DatePicker
														className='form-control'
														selected={startDate}
														onChange={handleDateChange}
														startDate={startDate}
														endDate={endDate}
														selectsRange
													/>
												</div>
												<button type="submit" className="btn btn-primary mt-3" onClick={handleCheck}>Check avaliablity</button>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="row m-auto">
				{roomType.map((room, index) => (
					<div className="col-lg-4 mb-4" key={index}>
						<div className="card">
							<div className="card-body row">
								<div className='col'>
									<h5 className="card-title">{room.roomType}</h5>
									<p className="card-text">Price: {room.price}</p>
									<p className="card-text">Adult Capacity: {room.capacity.adult}</p>
									<p className="card-text">Child Capacity: {room.capacity.child}</p>
									<p className="card-text">Avaliable rooms: {room.rooms && room.rooms.length}</p>
								</div>
								<div className='col my-auto '>
									<label className='m-1'>
										Rooms
									</label>
									<div className="input-group">
										<button className='incre-btn' type="button" onClick={(e) => handleRoomcountChange(e, index, false, -1)}>−</button>
										<input type="text" className="form-control text-center" value={roomCount[index]} />
										<button className='incre-btn' type="button" onClick={(e) => handleRoomcountChange(e, index, true, room.rooms.length)}>+</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className='d-flex justify-content-end mb-3'>
				{/* <input type="text" value={maxAdult}></input>
				<input type="text" value={maxChild}></input> */}
				<div className='d-flex w-50'>
					<label className="d-flex align-items-center m-4">
						Total Price
						</label>
					<input type="text" className='text-center' value={totalPrice}></input>
				</div>
				<button className='btn btn-primary' onClick={reserveRooms}>Reserve Rooms</button>
			</div>

			<div className="container">
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
						<div className='d-flex justify-content-end m-3'>
							<button className='btn btn-success'>Leave a Comment</button>
						</div>
					</div>


				</div>
			</div>



		</>
	)
}

export default Roompage