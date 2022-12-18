import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../../store/review'
import { useParams, useHistory } from 'react-router-dom';





function CreateReview() {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const [errors, setErrors] = useState([]);
    // const [validationErrors, setValidationErrors] = useState([])
    const history = useHistory()


    const [review, setReview] = useState('');
    const [stars, setStars] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            review,
            stars: +stars,
        };

        setErrors([]);
        const createreview = dispatch(createReview(payload, spotId))
            .catch(
                async (res) => {
                    if (!res.ok) {
                        const data = await res.json();
                        if (data.message.includes('Authentication required')) setErrors(['Need to be signed in to make a review'])
                        else if (data && data.errors) setErrors(data.errors);
                        else if (data && data.message) setErrors([data.message])
                        // setValidationErrors(errors)
                    }

                }
            )
        if(createreview) return history.push('/')

    };




    return (
        <>
            <h1>Create a Review</h1>
            <form onSubmit={handleSubmit}>
                {/* <ul>
                    {validationErrors.map((errorstwo) => (
                        <li key={errorstwo}>{errorstwo}</li>
                    ))}</ul> */}
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <label>
                    review
                    <input
                        type="text"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </label>
                <label>
                    stars
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={stars}
                        onChange={(e) => setStars(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">submit</button>
            </form>
        </>
    );
}







export default CreateReview;
