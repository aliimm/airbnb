import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import  AllSpots  from './components/Allspots/index'
import SpotDetails from "./components/SpotDetails";
import EditSpot from './components/EditSpot'
import CreateSpotModal from "./components/CreateSpotModal";

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
          <Route exact path='/api/spots/:spotId'>
            <SpotDetails/>
          </Route>
          <Route exact path='/api/spots/:spotId'>
            <EditSpot/>
          </Route>
          <Route exact path='/api/spots/create'>
            <CreateSpotModal/>
          </Route>

        </Switch>
      )}
    </>
  );
}

export default App;
