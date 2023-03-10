import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { getOneSpot } from '../../store/spots';
import { useParams, useHistory } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { deleteItem } from '../../store/spots';
import AllReviewsForSpot from '../ReviewsSpot';
import { getReviewsForSpot } from "../../store/review";
import { postBookingThunk } from '../../store/booking'
import moment from 'moment'
import './SpotDetails.css'

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

const SpotDetails = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user)
    const reviewFinder = useSelector(state => state.reviews.reviewList)
    const spotSelector = useSelector(state => state.spots.oneSpot);
    const currentSession = useSelector(state => state)
    let currentUser
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [errors, setErrors] = useState([])
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
    const handleSubmit = async (e) => {
        e.preventDefault()
        const dataErrors = []

        if (!sessionUser) dataErrors.push('Must be signed in to book')
        if (sessionUser && sessionUser.id === spotSelector.ownerId) dataErrors.push("Can't book your own spot")


        const splitStart = startDate.split('-')
        const splitEnd = endDate.split('-')

        const startYear = Number(splitStart[0])
        const startMonth = Number(splitStart[1])
        const startDay = Number(splitStart[2])

        const endYear = Number(splitEnd[0])
        const endMonth = Number(splitEnd[1])
        const endDay = Number(splitEnd[2])

        if (endYear < startYear) dataErrors.push("End date can't be before start date")
        if (endMonth < startMonth) dataErrors.push("End date can't be before start date")
        if (endDay <= startDay) dataErrors.push("End date can't be before or on the  start date")

        if (dataErrors.length) {
            setErrors(dataErrors)
        } else {

            const bookingData = {
                startDate,
                endDate
            }

            const postBooking = await dispatch(postBookingThunk(spotId, bookingData)).catch(
                async (res) => {
                    const data = await res.json()
                    if (data && data.errors) setErrors(Object.values(data.errors))
                    console.log('#$&(*#@&$*(32', Object.values(data.errors))
                }
            )

            if (postBooking) {
                history.push('/bookings')
            }
        }
    }



    return spotSelector && reviewFinder && (
        <nav className='container-detail-page'>
            <div className='detailsDiv'>
                <div className='imgContainer'>
                    <p className='title-details-spots'>{spotSelector.name}</p>
                    <div className='infobar'><i className="fa-sharp fa-solid fa-star"></i> {+spotSelector.avgStarRating ? spotSelector.avgStarRating.toFixed(2) : <>No Reviews Yet</>} · {spotSelector.numReviews} reviews  · {spotSelector.city}, {spotSelector.state}, {spotSelector.country}</div>
                    {spotSelector.SpotImages.map(x => (<div><img src={x.url} className='image' /></div>))}
                    {(spotSelector.ownerId === currentUser) &&
                        <div className='delete-spot-edit-spot-div'>
                            <NavLink className = 'update-spot-button-details' to={`/spots/${spotSelector.id}/edit`}>Update Spot</NavLink>
                            <button  className = 'delete-spot-button-details' onClick={deleteSpot} >Delete Spot</button>
                        </div>
                    }
                    <div className='container-booking-details'>
                        <div className='left-side-details'>
                            <div className='hostName'>
                                <div className='entire-host-message'>Entire place hosted by {spotSelector.Owner.firstName}
                                </div>
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


                        </div>
                        <div className='specialDiv'>
                            <p className='priceinspecial'>${spotSelector.price} night</p>

                            <form className='booking-form' onSubmit={handleSubmit} method="post">
                                    <ul>
                                        {errors.map((error, idx) => (
                                            <li key={idx}>{error}</li>
                                        ))}
                                    </ul>
                                <div className='date-fields'>
                                    <div>
                                        <input
                                            className='calenderinputone'
                                            type='date'
                                            required
                                            onChange={(e) => setStartDate(e.target.value)}
                                            value={startDate}
                                            min={new Date().toISOString().split('T')[0]}

                                        />
                                    </div>
                                    <div>

                                        <input
                                            className='calenderinputtwo'
                                            required
                                            type='date'
                                            onChange={(e) => setEndDate(e.target.value)}
                                            value={endDate}
                                            min={new Date().toISOString().split('T')[0]}

                                        />
                                    </div>
                                </div>

                                <div className='submit-booking-details'><button type='submit' className='submit-button-booking'>Reserve</button></div>

                            </form>

                        </div>
                    </div>

                    <div className='reviews-container-details'>

                            {(spotSelector.ownerId === currentUser || reviewFinder.find(element => element.userId === currentUser) || (currentUser === undefined)) ?
                                <h1></h1> :
                                <div className='create-a-review-div'>
                                    <NavLink  className='create-a-review' to={`/spots/${spotSelector.id}/createreview`}>Create a Review</NavLink>
                                </div>
                            }
                        <AllReviewsForSpot />
                    </div>

                </div>
            </div>
        </nav >
    )
}

export default SpotDetails
