import React from 'react'

const ChangePass = () => {
    return (

        <div className="tab-pane fade active show py-2" id="account-change-password">
            <div className="card-body pb-2">
                <div className="form-group">
                    <label className="form-label">Current password</label>
                    <input type="password" className="form-control" />
                </div>
                <div className="form-group">
                    <label className="form-label">New password</label>
                    <input type="password" className="form-control" />
                </div>
                <div className="form-group">
                    <label className="form-label">Repeat new password</label>
                    <input type="password" className="form-control" />
                </div>
            </div>
            <div className="d-flex justify-content-end m-1 p-2">
                <button type="button" className="btn btn-primary m-1">
                    Save changes
                </button>
            </div>
        </div>

    )
}

export default ChangePass