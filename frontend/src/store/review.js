import csrfFetch from "./csrf";
const LOAD = 'review/GETALLREVIEWS';
const CREATE = 'review/CREATEREVIEW'
const DELETE = 'review/DELETEREVIEW'


const reviewDelete = (deletereview) => {
    return {
        type: DELETE,
        deletereview
    }
}


const reviewLoad = (reviewList) => {
    return {
        type: LOAD,
        reviewList
    }
};

const reviewCreate = (createReview) => {
    return {
        type: CREATE,
        payload: createReview
    };
};

export const getReviewsForSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);


    if (response.ok) {
        const reviewData = await response.json();
        dispatch(reviewLoad(reviewData));
    }
};


export const deleteReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const review = await response.json();
      dispatch(reviewDelete(review));
    }
  };

export const createReview = (review, spotId) => async (dispatch) => {
    console.log(review)
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(reviewCreate(review));
        return review;
    }
};



const initialState = { spot: {}, user: {} }


const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD: {
            const newState = { ...state, spot: {} };
            newState.reviewList = action.reviewList.Reviews
            return newState
        }
        case CREATE: {
            const newState = { ...state, spot: { ...state.spot } };
            if (Array.isArray(action.payload)) {
                action.payload.forEach(spot => {
                    newState.spot[spot.id] = spot
                })
            } else {
                newState.spot[action.payload.id] = action.payload
            }
            return newState
        }

        case DELETE: {
            const newState = {...state}
            const SpotCopy = {...state.spot}
            delete SpotCopy[action.deletereview.id];
            newState.spot = SpotCopy
            return newState;
        }
        default:
            return state
    }
}
export default reviewReducer
