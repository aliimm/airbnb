import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import  AllSpots  from './components/Allspots/index'
import SpotDetails from "./components/SpotDetails";
import EditSpot from './components/EditSpot'
import CreateSpotModal from "./components/CreateSpotModal";
import CreateReview from "./components/CreateReview";
import SessionBookings from "./components/Bookings";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
          <Switch>
          <Route exact path='/'>
            <AllSpots />
          </Route>
          <Route exact path={'/spots/:spotId/createreview'}>
            <CreateReview/>
          </Route>
          <Route exact path='/spots/:spotId/edit'>
            <EditSpot/>
          </Route>
          <Route exact path='/spots/:spotId'>
            <SpotDetails/>
          </Route>
          <Route exact path='/'>
            <CreateSpotModal/>
          </Route>
          <Route exact path='/bookings'>
            <SessionBookings/>
          </Route>

        </Switch>
      )}
    </>
  );
}

export default App;
