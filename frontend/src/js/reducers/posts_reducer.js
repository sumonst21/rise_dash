import { FETCH_FILTERS, SELECT_FORM, SET_DATE_FILTER, SET_CONSULTANT_FILTER, SET_CALCULATION } from '../actions/index';

const INITIAL_STATE = {
    results: [],
};

export default function (state=INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_FILTERS:
            return {...state, results: action.payload.data.result};
    default:
        return state
    }
}