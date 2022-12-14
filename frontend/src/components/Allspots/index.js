import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import { NavLink } from 'react-router-dom';
import './AllSpots.css'


function AllSpots() {
    const dispatch = useDispatch()
    const spotSelector = useSelector(state => {

        return state.spots
    });
    const spotArray = Object.values(spotSelector)
    console.log(spotArray)

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);


    //   if(!spotSelector){
    //     return null
    //   }

    return (
        <nav className='container'>
            {spotArray.map(element => (
                <div className='spotCard' key={element.id}>
                    <NavLink to={`/api/spots/${element.id}`} >
                        <img src={element.previewImage} className='spotImg'></img>
                        <h3>{element.city}, {element.state}</h3>
                        <h3>{element.avgRating}</h3>
                        <h3>${element.price} night</h3>
                    </NavLink>
                </div>
            ))}


        </nav>
    );
}

export default AllSpots
