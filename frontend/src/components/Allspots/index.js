import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import { NavLink } from 'react-router-dom';
import './AllSpots.css';



function AllSpots() {
    const dispatch = useDispatch()
    const spotSelector = useSelector(state => {

        return state.spots.allSpots
    });
    console.log(spotSelector)
    const spotArray = Object.values(spotSelector)

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);


    //   if(!spotSelector){
    //     return null
    //   }

    return spotArray && (
        <nav className='container'>
            {spotArray.map(element => (
                <div className='spotCard' key={element.id}>
                    <NavLink to={`/spots/${element.id}`} >
                        <img src={element.previewImage} className='spotImg'></img>
                        <h3>{element.city}, {element.state}</h3>
                        {element.avgRating > 0 ? <div> <i class="fa-sharp fa-solid fa-star"></i> {element.avgRating.toFixed(2)}</div> : <div><i class='far fa-star'></i> No Reviews Yet</div>}
                        <h3>${element.price} night</h3>
                    </NavLink>
                </div>
            ))}


        </nav>
    );
}

export default AllSpots
