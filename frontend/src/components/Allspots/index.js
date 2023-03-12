import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import { NavLink } from 'react-router-dom';
import moment from 'moment'
import './AllSpots.css';


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
                        <div className = 'city-state-rating-div'>
                            <p className='all-spots-text'><b>{element.city}, {element.state}</b></p>
                            {element.avgRating > 0 ? <div className='rating-all-spots-card'> <i class="fa-sharp fa-solid fa-star"></i> {element.avgRating.toFixed(2)}</div> : <div className='all-spots-text'><i class='far fa-star'></i></div>}
                        </div>
                        <p className='posted-stamp-allspots'>Posted {moment(new Date(element.createdAt)).fromNow()}</p>
                        <p className='all-spots-text'><b>${element.price}</b> night</p>
                    </NavLink>
                </div>
            ))}


        </nav>
    );
}

export default AllSpots
