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

    }, [spotId, dispatch]);

        const deleteSpot = async (e) => {
            e.preventDefault()
            await dispatch(deleteItem(spotId))
            history.push('/')
        }

        if (!spotSelector?.SpotImages) {
            return null
        }


        return spotSelector && reviewFinder &&(
            <nav>
                <div className='detailsDiv'>
                    <h1 className='title'>{spotSelector.description}</h1>
                    <div className='infobar'><i className="fa-sharp fa-solid fa-star"></i> {+spotSelector.avgStarRating ? spotSelector.avgStarRating.toFixed(2): <>No Reviews Yet</>} · {spotSelector.numReviews} reviews  · {spotSelector.city}, {spotSelector.state}, {spotSelector.country}</div>
                    <div className='imgContainer'>
                        {spotSelector.SpotImages.map(x => (<div><img src={x.url} className='image' /></div>))}


                    { (spotSelector.ownerId === currentUser) &&
                    <div>
                    <NavLink to={`/spots/${spotSelector.id}/edit`}>Update Spot</NavLink>
                    <h1></h1>
                    <button onClick={deleteSpot} >Delete Spot</button>
                    </div>
                    }

                    <div className='hostName'>
                        <h2>Entire guest BNB hosted by {spotSelector.Owner.firstName}  <i class="fa-solid fa-user"></i></h2>
                    </div>
                          { (spotSelector.ownerId === currentUser || reviewFinder.find(element => element.userId === currentUser) || (currentUser === undefined)) ?
                          <h1></h1>:
                        <div>
                        <NavLink to={`/spots/${spotSelector.id}/createreview`}>Create a Review</NavLink>
                        </div>
                        }

                    <div>
                        <AllReviewsForSpot/>
                    </div>
                    <div className='specialDiv'>
                        <h1 className='priceinspecial'>Price ${spotSelector.price}</h1>




                    </div>
                    </div>
                </div>
            </nav >
        )
}

export default SpotDetails
