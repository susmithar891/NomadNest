import React, { useState, useRef } from 'react';
import request from '../api/axios';

function CommentModel() {

    const [bookingId, setBookingId] = useState('');
    const [password, setPassword] = useState('');
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!rating){
            alert('please give us a rating')
            return 
        }
        console.log({ bookingId, password, rating, comment });
        try {
            const res = await request.post(`/api/user/rate`, { bookingId, password, rating, comment })
            resetForm();
            closeDialog();
        }
        catch (e) {
            console.log(e)
        }

    };

    const resetForm = () => {
        setBookingId('');
        setPassword('');
        setRating(null);
        setComment('');
    };

    const dialogBox = useRef(null);

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
            resetForm();
            dialogBox.current.close();
        }
    };

    return (
        <>
            <button className='btn btn-primary container m-2' onClick={toggleDialog}>Leave a Comment</button>
            <dialog ref={dialogBox} className='border rounded'>
                <div className="container">
                    <h2 className="p-2">Leave Your Ratings</h2>
                    <form onSubmit={handleSubmit} style={{ width: "750px" }}>
                        <div className="form-group p-2 mb-2">
                            <label htmlFor="bookingIdInput">BookingId</label>
                            <input
                                type="text"
                                className="form-control"
                                id="bookingIdInput"
                                placeholder="Enter bookingId"
                                value={bookingId}
                                required
                                onChange={(e) => setBookingId(e.target.value)}
                            />
                        </div>
                        <div className="form-group p-2 mb-2">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="exampleInputPassword1"
                                placeholder="Enter password sent to your mailId on booking a room"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <label htmlFor="rating" className="form-label  my-auto">Rating: </label>
                            <div id="rating" className="star-rating ">
                                {[5, 4, 3, 2, 1].map(num => (
                                    <React.Fragment key={num}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={num}
                                            id={`rating-${num}`}
                                            style={{ display: "none" }}
                                            checked={rating === num}
                                            onChange={() => setRating(num)}
                                        />
                                        <label htmlFor={`rating-${num}`} className="star">&#9733;</label>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comment" className="form-label">Comment:</label>
                            <textarea
                                className="form-control"
                                id="comment"
                                rows="3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                        <div className='d-flex m-2'>
                            <button type="submit" className="btn btn-primary m-1">Submit</button>
                            <button type="button" className="btn btn-danger m-1" onClick={closeDialog}>Close</button>
                        </div>
                    </form>
                </div>
            </dialog>

            <style jsx>{`
                .star-rating {
                    direction: rtl;
                    font-size: 2rem;
                    color: #ddd;
                }
                .star-rating input[type="radio"] {
                    display: none;
                }
                .star-rating label.star {
                    cursor: pointer;
                    color: grey;
                    transition: color 0.2s ease-in-out;
                }
                .star-rating input[type="radio"]:checked ~ label.star,
                .star-rating label.star:hover,
                .star-rating label.star:hover ~ label.star {
                    color: #ffcc00;
                }
            `}</style>
        </>
    );
}

export default CommentModel;
