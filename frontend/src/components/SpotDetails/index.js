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
    if (currentSession.session.user) {

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


    return spotSelector && reviewFinder && (
        <nav className='container-detail-page'>
            <div className='detailsDiv'>
                <div className='imgContainer'>
                    <p className='title-details-spots'>{spotSelector.name}</p>
                    <div className='infobar'><i className="fa-sharp fa-solid fa-star"></i> {+spotSelector.avgStarRating ? spotSelector.avgStarRating.toFixed(2) : <>No Reviews Yet</>} · {spotSelector.numReviews} reviews  · {spotSelector.city}, {spotSelector.state}, {spotSelector.country}</div>
                    {spotSelector.SpotImages.map(x => (<div><img src={x.url} className='image' /></div>))}
                    {(spotSelector.ownerId === currentUser) &&
                        <div>
                            <NavLink to={`/spots/${spotSelector.id}/edit`}>Update Spot</NavLink>
                            <h1></h1>
                            <button onClick={deleteSpot} >Delete Spot</button>
                        </div>
                    }
                    <div className='container-booking-details'>
                        <div className='left-side-details'>
                            <div className='hostName'>
                                <div className='entire-host-message'>Entire place hosted by {spotSelector.Owner.firstName}</div>
                                <div className='pfp-hostname-div'><img className='owner-pfp-spot-details' src={spotSelector.Owner.profileimg}></img></div>
                            </div>

                            <div className='superhost-div'>
                                <div><i class="fa-solid fa-medal fa-xl"></i></div>
                                <div className='host-div-right-side'>
                                    <div className='super-host-title'>{spotSelector.Owner.firstName} is a Superhost</div>
                                    <div className='super-host-message-desc'>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests</div>
                                </div>
                            </div>

                            <div className='amenities-container'>
                                <div className='single-amenity-container'>
                                    <div className='amenity-icon'><i class="fa-solid fa-door-open fa-xl"></i></div>
                                    <div className='amenity-text'>
                                        <div className='amenities-title'>Self check-in</div>
                                        <div className='amenities-desc'>Check yourself in with the lockbox.</div>
                                    </div>
                                </div>

                                <div className='single-amenity-container'>
                                    <div className='amenity-icon'><i class="fa-solid fa-location-dot fa-xl"></i></div>
                                    <div className='amenity-text'>
                                        <div className='amenities-title'>Great location</div>
                                        <div className='amenities-desc'>100% of recent guests gave the location a 5-star rating.</div>
                                    </div>
                                </div>

                                <div className='single-amenity-container'>
                                    <div className='amenity-icon'><i class="fa-solid fa-key fa-xl"></i></div>
                                    <div className='amenity-text'>
                                        <div className='amenities-title'>Great check-in experience</div>
                                        <div className='amenities-desc'>100% of recent guests gave the check-in process a 5-star rating.</div>
                                    </div>
                                </div>
                            </div>


                            <div className='descriptionBlock'>
                                <p className='desc-one-spot'>{spotSelector.description}</p>
                            </div>



                            {(spotSelector.ownerId === currentUser || reviewFinder.find(element => element.userId === currentUser) || (currentUser === undefined)) ?
                                <h1></h1> :
                                <div>
                                    <NavLink to={`/spots/${spotSelector.id}/createreview`}>Create a Review</NavLink>
                                </div>
                            }

                        </div>
                        <div className='specialDiv'>
                            <p className='priceinspecial'>${spotSelector.price} night</p>

                        </div>
                    </div>

                    <div className='reviews-container-details'>
                        <AllReviewsForSpot />
                    </div>

                </div>
            </div>
        </nav >
    )
}

export default SpotDetails
