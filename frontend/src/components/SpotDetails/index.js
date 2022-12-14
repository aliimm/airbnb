import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { getOneSpot } from '../../store/spots';
import { useParams, useHistory } from 'react-router-dom';
import EditSpot from '../EditSpot';

import './SpotDetails.css'


const SpotDetails = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const { spotId } = useParams();
    // console.log('!!!!!!!!!!', spotId)
    const spotSelector = useSelector(state => state.spots);
    // const spotArray = Object.values(spotSelector)

    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [spotId]);
    if (!spotSelector.SpotImages){
        return null
    }

    return (
        <nav>
            <div className='detailsDiv'>
                <h1 className='title'>{spotSelector.description}</h1>
                <h4><i className="fa-sharp fa-solid fa-star"></i> {spotSelector.avgStarRating} · {spotSelector.numReviews} reviews  · {spotSelector.city}, {spotSelector.state}, {spotSelector.country}</h4>
                <div className='imgContainer'>
                {spotSelector.SpotImages.map(x => (<img src={x.url} className='image'/>))}
                <button onClick={() => history.push('')}>Edit</button>


                </div>




            </div>
        </nav >
    )
}

export default SpotDetails
