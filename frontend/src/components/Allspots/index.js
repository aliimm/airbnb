import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';

function AllSpots() {
    const dispatch = useDispatch()
    const spotSelector = useSelector(state => {
        // console.log('!!!!!', state)
        return state.spots
      });

      useEffect(() => {
        dispatch(getAllSpots());
      }, [dispatch]);

    //   if(!spotSelector){
    //     return null
    //   }


    return (
      <nav>
        <h1>hello</h1>
      </nav>
    );
  }

export default AllSpots
