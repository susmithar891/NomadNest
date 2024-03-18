import React from 'react'

const RatingBar = ({ rating, maxRating }) => {
    const widthPercentage = (rating / maxRating) * 100;

    return (
        <div className="progress" style={{ height: '20px', marginBottom: '10px' }}>
            <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${widthPercentage}%` }}
                aria-valuenow={rating}
                aria-valuemin="0"
                aria-valuemax={maxRating}
            >
                {rating}
            </div>
        </div>
    );
};


export default RatingBar
