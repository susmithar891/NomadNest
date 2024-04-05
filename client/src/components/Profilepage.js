import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styling/profilePage.css'
import GeneralAccount from './Profile/GeneralAccount'
import ReserveInfo from './Profile/ReserveInfo'
import ChangePass from './Profile/ChangePass'
import { Navbar } from './Navbar'
import request from '../api/axios'


const Profilepage = () => {

	const location = useLocation();
	const navigate = useNavigate()
	useEffect(() => {

		const checkToken = async () => {

			try {
				const res = await request.post('/api/check')
				console.log(res.data)
				if (res.data.redirect === "home") {
					// navigate('/home')
					return
				}
			}
			catch (e) {
				// navigate("/")
				console.log(e)
			}
			navigate("/")

		}
		checkToken()


	}, [])

	return (
		<>

			<Navbar profile={false} />
			<div className="container light-style flex-grow-1 container-p-y">
				<h4 className="font-weight-bold py-3 mb-4">Account settings</h4>
				<div className="card overflow-hidden">
					<div className="row no-gutters row-bordered row-border-light">
						<div className="col-md-3 pt-0">
							<div className="list-group list-group-flush account-settings-links">
								<Link
									className="list-group-item list-group-item-action"
									data-toggle="list"
									to="/home/profile"
								>
									General
								</Link>
								<Link
									className="list-group-item list-group-item-action"
									data-toggle="list"
									to="?account-change-password"
								>
									Change password
								</Link>
								<Link
									className="list-group-item list-group-item-action"
									data-toggle="list"
									to="?my-reservings"
								>
									My Reservings
								</Link>
							</div>
						</div>
						<div className="col-md-9">
							<div className="tab-content overflow-auto mh-50">

								{location.search === "" && <GeneralAccount />}
								{location.search === "?account-change-password" && <ChangePass />}
								{location.search === "?my-reservings" && <ReserveInfo />}								

							</div>
						</div>
					</div>
				</div>




			</div>
		</>

	)
}

export default Profilepage