import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteReview } from '../../store/review'
import { useHistory } from 'react-router-dom';
import './reviewspot.css'


function AllReviewsForSpot() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [errors, setErrors] = useState([]);



    const reviewSelector = useSelector(state => {
        return state.reviews.reviewList
    });
    const spotSelector = useSelector(state => {
        return state.spots.oneSpot
    });
    console.log(spotSelector)

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

            <div className='title-reviews'><i class="fa-solid fa-star"></i>
                {reviewArray.length === 0 ?

                    <> No Reviews Yet</> :
                    <>{spotSelector.avgStarRating.toFixed(2)} · {reviewArray.length} reviews</>

                }
            </div>

            <nav className='container-reviews'>
                {reviewArray?.length ? reviewArray?.map(element => (
                    <div className='reviewCard' key={element.id}>
                        <div className='review-card-img-and-name'>
                            <div><img className='profileimg-reviewcard' src={element.User.profileimg}></img></div>
                            <div className='user-name-review'>
                                <div>{element.User.firstName}</div>
                                <div>{element.createdAt}</div>
                            </div>
                        </div>
                        <div className='review-message'>{element.review}</div>

                        {/* <h4>{element.stars} <i class="fa-solid fa-star"></i></h4> */}
                        {/* < button onClick={() => reviewDelete(element.id)} >Delete Review</button> */}

                    </div>
                )) : <div>No Reviews Yet</div>
                }


            </nav >

        </nav >


    )
}
export default AllReviewsForSpot
