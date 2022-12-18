import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {deleteReview} from '../../store/review'
import {  useHistory, useParams } from 'react-router-dom';


function AllReviewsForSpot() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [errors, setErrors] = useState([]);

    const { spotId } = useParams();


    const reviewSelector = useSelector(state => {
        return state.reviews.reviewList
    });

    const reviewArray = Object?.values(reviewSelector)
    // console.log("sdlkfjladksfj",reviewArray)

    const reviewDelete = async (reviewId) => {
        // console.log("this is reviewId", reviewId)
        return dispatch(deleteReview(reviewId))
        .then(() => history.push('/'))
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
        );

    }




    return reviewArray && reviewDelete && (
        <nav>
            <p>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </p>
            <h1>reviews</h1>
            <nav className='container'>
                {reviewArray?.length ? reviewArray?.map(element => (
                    <div className='reviewCard' key={element.id}>
                        <h3>{element.review}</h3>
                        <button onClick= {() => reviewDelete(element.id)} >Delete Review</button>

                    </div>
                )) : <div>no reviews</div>}


            </nav>

        </nav>


    )
}
export default AllReviewsForSpot
