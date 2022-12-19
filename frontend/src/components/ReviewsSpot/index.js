import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {deleteReview} from '../../store/review'
import {  useHistory } from 'react-router-dom';


function AllReviewsForSpot() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [errors, setErrors] = useState([]);



    const reviewSelector = useSelector(state => {
        return state.reviews.reviewList
    });

    const reviewArray = Object?.values(reviewSelector)

    const reviewDelete = async (reviewId) => {
        return dispatch(deleteReview(reviewId))
        .then(() => history.push('/'))
        .catch(
            async (res) => {
                if (!res.ok) {
                    const data = await res.json();
                    if (data.message.includes('Authentication required')) setErrors(['Need to be signed in to make or delete a review'])
                    else if (data && data.errors) setErrors(data.errors);
                    else if (data && data.message) setErrors([data.message])

                }



            }
        );

    }




    return reviewArray && reviewDelete && (
        <nav>
            <p>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </p>
            <h1>Reviews</h1>
            <nav className='container'>
                {reviewArray?.length ? reviewArray?.map(element => (
                    <div className='reviewCard' key={element.id}>
                        <h3>{element.User.firstName}: {element.review} </h3>
                        <h4>{element.stars} <i class="fa-solid fa-star"></i></h4>
                        <button onClick= {() => reviewDelete(element.id)} >Delete Review</button>

                    </div>
                )) : <div>No Reviews Yet</div>}


            </nav>

        </nav>


    )
}
export default AllReviewsForSpot
