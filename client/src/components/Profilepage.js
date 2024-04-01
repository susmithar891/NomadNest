import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styling/profilePage.css'
import GeneralAccount from './Profile/GeneralAccount'
import AccountInfo from './Profile/AccountInfo'
import ChangePass from './Profile/ChangePass'
import { Navbar } from './Navbar'


const Profilepage = () => {

  const location = useLocation();
  // const navigate = useNavigate();

  return (
    <>
    
      <Navbar profile={false}/>
      <div className="container light-style flex-grow-1 container-p-y">
        <h4 className="font-weight-bold py-3 mb-4">Account settings</h4>
        <div className="card overflow-hidden">
          <div className="row no-gutters row-bordered row-border-light">
            <div className="col-md-3 pt-0">
              <div className="list-group list-group-flush account-settings-links">
                <a
                  className="list-group-item list-group-item-action"
                  data-toggle="list"
                  href="?account-general"
                >
                  General
                </a>
                <a
                  className="list-group-item list-group-item-action"
                  data-toggle="list"
                  href="?account-change-password"
                >
                  Change password
                </a>
                <a
                  className="list-group-item list-group-item-action"
                  data-toggle="list"
                  href="?my-bookings"
                >
                  My bookings
                </a>
              </div>
            </div>
            <div className="col-md-9">
              <div className="tab-content overflow-auto mh-50">

                {location.search === "?account-general" && <GeneralAccount/>}
                {location.search === "?my-bookings" && <AccountInfo/>}
                {location.search === "?account-change-password" && <ChangePass/>}

              </div>
            </div>
          </div>
        </div>


        <div className="d-flex justify-content-end mt-3">
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
          <button type="button" className="btn btn-default">
            Cancel
          </button>
        </div>




      </div>
    </>

  )
}

export default Profilepage