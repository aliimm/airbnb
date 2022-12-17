import React, { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import {createReview} from '../../store/review'
import { useParams, useHistory } from 'react-router-dom';





function CreateReview() {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const [errors, setErrors] = useState([]);
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
         const reviewDispatch = dispatch(createReview(payload, spotId))
        .catch(
            async (res) => {
              const data = await res.json();
              if (data && data.errors) setErrors(data.errors);
              if(data && data.message) setErrors([data.message])
            }
          );

        if (reviewDispatch) {
            history.push(`/`);
        }
    };




    return (
        <>
            <h1>Create a Review</h1>
            <form onSubmit={handleSubmit}>
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
