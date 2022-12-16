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
    const currentUser = useSelector(state => state.session.user.id);
    console.log("abc",currentUser)
    console.log("def",spotSelector.ownerId)


    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [spotId]);

    // useEffect(() => {
    //     dispatch(deleteItem(spotId))
    // }, [spotId])

    const deleteSpot = async (e) => {
        e.preventDefault()
        await dispatch(deleteItem(spotId))
        history.push('/')
    }

    if (!spotSelector.SpotImages) {
        return null
    }

    // if (spotId === ownerId)


        return (
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
                    </div>




                </div>
            </nav >
        )
}

export default SpotDetails
