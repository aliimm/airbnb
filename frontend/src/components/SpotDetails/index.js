import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { getOneSpot } from '../../store/spots';
import { useParams, useHistory } from 'react-router-dom';
import EditSpot from '../EditSpot';
import { NavLink } from 'react-router-dom';
import { deleteItem } from '../../store/spots';


import './SpotDetails.css'


const SpotDetails = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spotSelector = useSelector(state => state.spots.oneSpot);

    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [spotId]);

    // useEffect(() => {
    //     dispatch(deleteItem(spotId))
    // }, [spotId])

    const deleteSpot = async (e) => {
        e.preventDefault()
        let deletedspot = dispatch(deleteItem(spotId))
        if(deletedspot) history.push('/')
    }

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

                
                <NavLink to={`/spots/${spotSelector.id}/edit`}>Update Spot</NavLink>
                <button onClick={deleteSpot} >Delete Spot</button>



                </div>




            </div>
        </nav >
    )
}

export default SpotDetails
