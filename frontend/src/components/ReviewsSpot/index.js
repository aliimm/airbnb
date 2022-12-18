import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {deleteReview} from '../../store/review'
import {  useHistory, useParams } from 'react-router-dom';


function AllReviewsForSpot() {
    const dispatch = useDispatch();
    const history = useHistory()
    const { spotId } = useParams();


    const reviewSelector = useSelector(state => {
        return state.reviews.reviewList
    });

    const reviewArray = Object?.values(reviewSelector)
    // console.log("sdlkfjladksfj",reviewArray)

    const reviewDelete = async (reviewId) => {
        // console.log("this is reviewId", reviewId)
        await dispatch(deleteReview(reviewId))
        // e.preventDefault()
    //     reviewArray.forEach(element => {
    //     // if(element.userId !== sessionUserId){
    //     //     errors.push('This is not your Review')
    //     // }
    //     console.log(element.id)
    // })


        history.push(`/`)
    }




    return reviewArray && reviewDelete && (
        <nav>
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
