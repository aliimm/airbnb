const LOAD = 'spots/GETALLSPOTS';
const ONE = 'spots/GETONESPOT';
const EDIT = 'spots/EDITSPOT'
const CREATE = 'spots/CREATESPOT'

const edit = (specificSpot) => ({
    type: EDIT,
    specificSpot
})

const load = (spotList) => ({
    type: LOAD,
    spotList
});

const one = (oneSpot) => ({
    type: ONE,
    oneSpot
})

const create = (createSpot) => ({
    type: CREATE,
    createSpot
})

export const createOneSpot = (newSpot) => async (dispatch) => {
    const response = await fetch('/api/spots/create', /*UNSURE ABOUT FETCH?*/{
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


export const editOneSpot = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotId),
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(edit(spot));//THIS probaby needs to be changed
        return spot;
    }
};





export const getOneSpot = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(one(spot));
    }
};


export const getAllSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);

    if (response.ok) {
        const spotData = await response.json();
        dispatch(load(spotData));
    }
};


// const initalState = {allSpots = {}, specificSpot = {}};

const spotReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD:
            const allSpots = {};
            action.spotList.Spots.forEach(spot => {
                allSpots[spot.id] = spot;
            });
            return allSpots;
        case ONE:
            console.log(action.oneSpot)
            return action.oneSpot
        case CREATE:
                const newState = {
                  ...state,
                  [action.spot.id]: action.spot,
                };
                const spotList = newState.list.map((id) => newState[id]);
                spotList.push(action.pokemon);
                return newState;
              }
              return {
                ...state,
                [action.pokemon.id]: {
                  ...state[action.pokemon.id],
                  ...action.pokemon,
                },
            }

        default:
            return state
    }
}

export default spotReducer
