const LOAD = 'spots/GETALLSPOTS';

const load = (spotList) => ({
    type: LOAD,
    spotList
});

export const getAllSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);

    if (response.ok) {
        const spotData = await response.json();
        dispatch(load(spotData));
    }
};


const initialState = {}
const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            const allSpots = {};
            action.spotList.Spots.forEach(spot => {
                allSpots[spot.id] = spot;
            });
            return allSpots
        default:
            return state
    }
}

export default spotReducer
