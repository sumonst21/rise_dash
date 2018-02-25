import { FETCH_FILTERS, SELECT_FORM, SET_DATE_FILTER, SET_CONSULTANT_FILTER } from '../actions/index';

const INITIAL_STATE = {consultantFilter: '', dateFilter: '', form: [], hasDate: false, hasConsultant: false, results: []};

export default function (state=INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_FILTERS:
            return {...state, results: action.payload.data.result};
        case SELECT_FORM:
            return {
                ...state,
                form: action.payload.data,
                hasDate: action.payload.data[0].hasOwnProperty('date_of_session'),
                hasConsultant: action.payload.data[0].hasOwnProperty('your_peer_learning_group'),
                dateFilter: '',
                consultantFilter: ''
            };
        case SET_DATE_FILTER:
            return {...state, dateFilter: action.payload };
        case SET_CONSULTANT_FILTER:
            return {...state, consultantFilter: action.payload};
    default:
        return state
    }
}