import React from 'react'

const GeneralAccount = (props) => {
    console.log(props.userState)
    return (
        <div className="container tab-pane fade active show" id="account-general">
            <div className="d-flex m-2">
                <div className='m-1'>
                    <img
                        src="https://bootdey.com/img/Content/avatar/avatar1.png"
                        alt=""
                        className="d-block ui-w-80 rounded"
                    />
                </div>

                <div className='m-1'>
                    <label className="btn btn-outline-primary m-1">
                        Upload new photo
                        <input type="file" className="account-settings-fileinput" />
                    </label>
                    <div className="text-light small mt-1">
                        Allowed JPG, GIF or PNG. Max size of 800K
                    </div>
                </div>

            </div>
            <hr className="border-light m-0" />
            <div className="card-body">
                <div className="form-group">
                    <label className="form-label">firstName</label>
                    <input
                        type="text"
                        className="form-control mb-1"
                        value={props.userState.firstName}
                        placeholder='firstname'
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">lastName</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='lastname'
                        value={props.userState.lastName}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Registered Email</label>
                    <input
                        type="text"
                        className="form-control mb-1"
                        placeholder='email'
                        value={props.userState.email}
                    />
                    {/* <div className="alert alert-warning mt-3">
                        Your email is not confirmed. Please check your inbox.
                        <br />
                        <a href="javascript:void(0)">Resend confirmation</a>
                    </div> */}
                </div>
            </div>
            <div className="d-flex justify-content-end m-2">
                <button type="button" className="btn btn-primary">
                    Save changes
                </button>
            </div>
        </div>
    )
}


export default GeneralAccount
