import csrfFetch from "./csrf";
const LOAD = 'spots/GETALLSPOTS';
const ONE = 'spots/GETONESPOT';
const EDIT = 'spots/EDITSPOT'
const CREATE = 'spots/CREATESPOT'
const DELETE = 'spot/DELETESPOT'


const spotDelete = (deleteSpot)=> {
    return {
        type: DELETE,
        deleteSpot
    }
}

const edit = (specificSpot) => {
    return {
        type: EDIT,
        specificSpot
    }
}

const load = (spotList) => {
    return {
        type: LOAD,
        spotList
    }
};

const one = (oneSpot) => {
    return {
        type: ONE,
        oneSpot
    }
}

const create = (createSpot) => {
    return {
        type: CREATE,
        payload: createSpot
    };
};

export const deleteItem = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const { id: spotId } = await response.json();
      dispatch(spotDelete(spotId));
    }
  };

export const createOneSpot = (newSpot) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', /*UNSURE ABOUT FETCH?*/{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpot),
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(create(spot));
        return spot;
    }
};


export const editOneSpot = (updatedSpot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${updatedSpot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSpot),
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(edit(spot));
        return spot;
    }
};


export const getOneSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(one(spot));
    }
};


export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
        const spotData = await response.json();
        dispatch(load(spotData));
    }
};


const initialState = { allSpots: {}, oneSpot: {} }


const spotReducer = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case LOAD: {
            const newState = { allSpots: {}, oneSpot: {} };
            action.spotList.Spots.forEach(spot => newState.allSpots[spot.id] = spot);
            return newState;
        }
        case ONE: {
            const newState = { ...state, oneSpot: {} };
            newState.oneSpot = action.oneSpot
            return newState
        }
        case CREATE: {
            const newState = { ...state, allSpots: { ...state.allSpots } };
            if (Array.isArray(action.payload)) {
                action.payload.forEach(spot => {
                    newState.allSpots[spot.id] = spot
                })
            } else {
                newState.allSpots[action.payload.id] = action.payload
            }
            return newState
        }
        case EDIT: {
            const newState = { ...state, allSpots: { ...state.allSpots } };
            if (Array.isArray(action.specificSpot)) {
                action.specificSpot.forEach(spot => {
                    newState.allSpots[spot.id] = spot
                })
            } else {
                newState.allSpots[action.specificSpot.id] = action.specificSpot
            }
            return newState
        }
        case DELETE: {
            const newState = {...state}
            delete newState.allSpots[action.deleteSpot];
            // delete newState.oneSpot[action.deleteSpot];
            return newState;
        }
        default:
            return state
    }
}

export default spotReducer
