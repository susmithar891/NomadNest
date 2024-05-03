import React, { useRef, useState } from 'react'
import request from '../../api/axios'

const VerifyUser = (props) => {

    const dialogBox = useRef(null)
    const [Doc, setDoc] = useState()

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setDoc(imageUrl);  // Store the URL instead of the file object
        }
    };

    const toggleDialog = () => {
        if (!dialogBox.current) {
            return;
        }
        if (dialogBox.current.open) {
            closeDialog();
        } else {
            dialogBox.current.showModal();
        }
    };

    const closeDialog = () => {
        if (!dialogBox.current) {
            return;
        }
        if (dialogBox.current.open) {
            dialogBox.current.close();
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (!Doc) {
			alert("upload an image to proceed")
			return;
		}
        const formData = new FormData()
		formData.append('imgFile', Doc)
		try {
			// setprofileLoading(true)
			const res = await request.post(`/api/User/${props.reserveId}/verify`, formData);
			if (res.status === 200) {
				console.log(res)
				if (res.data.msg) {
                    props.reserveFunc(props.reservings.map(item => {
                        if (item._id === props.reserveId) {
                            return { ...item, isVerified: true };
                        }
                        return item;
                    }));
                }
			}
		} catch (e) {
			console.log(e)
			// setprofileLoading(false)
		}
    }


    return (
        <>
            <button className='btn btn-primary container m-2' onClick={toggleDialog}>Verify User</button>
            <dialog ref={dialogBox} className='border rounded'>
                <div className="container">
                    <h2 className="p-2">Add your verification</h2>
                    <form onSubmit={handleSubmit} style={{ width: "750px" }}>
                        <label className="btn btn-outline-primary m-1">
                            Capture Photo
                            <input type="file" className="account-settings-fileinput" capture="camera" onChange={handleFileChange} accept="image/*" required />
                        </label>
                        {Doc && <img style={{height :"300px", width : "300px" }} src={Doc}></img>}

                        <div className='d-flex m-2'>
                            <button type="submit" className="btn btn-primary m-1">Submit</button>
                            <button type="button" className="btn btn-danger m-1" onClick={closeDialog}>Close</button>
                        </div>
                    </form>
                </div>
            </dialog>

        </>

    )
}

export default VerifyUser