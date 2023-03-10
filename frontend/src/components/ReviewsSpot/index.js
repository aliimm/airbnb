import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteReview } from '../../store/review'
import { useHistory } from 'react-router-dom';
import moment from 'moment'
import './reviewspot.css'

moment.updateLocale("en", {
    relativeTime: {
        future: (diff) => (diff === "just now" ? diff : `in ${diff}`),
        past: (diff) => (diff === "just now" ? diff : `${diff} ago`),
        s: "just now",
        ss: "just now",
        m: "1 minute",
        mm: "%d minutes",
        h: "1 hour",
        hh: "%d hours",
        d: "1 day",
        dd: "%d days",
        M: "1 month",
        MM: "%d months",
        y: "1 year",
        yy: "%d years",
    },
});


function AllReviewsForSpot() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [errors, setErrors] = useState([]);



    const reviewSelector = useSelector(state => {
        return state.reviews.reviewList
    });

    const sessionUser = useSelector(state => state.session.user)

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
                                <div className='review-user-left'>{element.User.firstName}</div>
                                <div className='timestamp-moment'>{moment(new Date(element.createdAt)).fromNow()}</div>
                            </div>
                        </div>
                        <div className='review-message'>{element.review}</div>

                        {/* <h4>{element.stars} <i class="fa-solid fa-star"></i></h4> */}
                        {element.User.id === sessionUser.id &&
                            <button className = 'delete-review-button' onClick={() => reviewDelete(element.id)} >Delete Review</button>
                        }

                    </div>
                )) : <div>No Reviews Yet</div>
                }


            </nav >

        </nav >


    )
}
export default AllReviewsForSpot
