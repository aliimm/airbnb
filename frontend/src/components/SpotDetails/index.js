import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { getOneSpot } from '../../store/spots';
import { useParams, useHistory } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { deleteItem } from '../../store/spots';
import AllReviewsForSpot from '../ReviewsSpot';
import { getReviewsForSpot } from "../../store/review";


import './SpotDetails.css'


const SpotDetails = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const reviewFinder = useSelector(state => state.reviews.reviewList)
    const spotSelector = useSelector(state => state.spots.oneSpot);
    const currentSession = useSelector(state => state)
    let currentUser
    if(currentSession.session.user){

     currentUser = currentSession.session.user.id
    }



    useEffect(() => {
        dispatch(getReviewsForSpot(spotId))
        .then(() => dispatch(getOneSpot(spotId)))
    }, [spotId]);

    // useEffect(() => {
    //     dispatch(deleteItem(spotId))
    // }, [spotId])

    const deleteSpot = async (e) => {
        e.preventDefault()
        await dispatch(deleteItem(spotId))
        history.push('/')
    }

    if (!spotSelector?.SpotImages) {
        return null
    }

    // if (spotId === ownerId)


        return spotSelector && (
            <nav>
                <div className='detailsDiv'>
                    <h1 className='title'>{spotSelector.description}</h1>
                    <h4><i className="fa-sharp fa-solid fa-star"></i> {spotSelector.avgStarRating} · {spotSelector.numReviews} reviews  · {spotSelector.city}, {spotSelector.state}, {spotSelector.country}</h4>
                    <div className='imgContainer'>
                        {spotSelector.SpotImages.map(x => (<img src={x.url} className='image' />))}

                        { (spotSelector.ownerId === currentUser) &&
                        <div>
                        <NavLink to={`/spots/${spotSelector.id}/edit`}>Update Spot</NavLink>
                        <button onClick={deleteSpot} >Delete Spot</button>
                        </div>
                        }
                        {/* {reviewFinder.map(x =>(
                            x.userID === currentUser
                        ))

                        } */}
                          { (spotSelector.ownerId !== currentUser ) &&
                        <div>
                        <NavLink to={`/spots/${spotSelector.id}/createreview`}>Create a Review</NavLink>
                        </div>
                        }

                    <div>
                        <AllReviewsForSpot/>
                    </div>



                    </div>




                </div>
            </nav >
        )
}

export default SpotDetails
