import axios from 'axios';

// const API_URL = process.env.BASE_API_URL;
// const API_URL = 'https://api.appmachine.com/v1/data/';
const API_URL = 'http://localhost:8081/form_data/';

export const FETCH_FILTERS = 'FETCH_FILTERS';
export const SELECT_FORM = 'SELECT_FORM';
export const SET_DATE_FILTER = 'SET_DATE_FILTER';
export const SET_CONSULTANT_FILTER = 'SET_CONSULTANT_FILTER';


function getHeaders () {
    return {
        'Authorization': `Token ${localStorage.token}`,
    }
}

export function fetchFilters() {
    const url = `${API_URL}`;
    const request = axios.get(url, {headers: getHeaders()});
    console.log(request);
    return {
        type: FETCH_FILTERS,
        payload: request
    }
}

export function selectForm(form) {
    const url = `${API_URL}${form}/`;
    const request = axios.get(url, {headers: getHeaders()});

    return {
        type: SELECT_FORM,
        payload: request
    }
}

export function selectDate(date) {
    return {
        type: SET_DATE_FILTER,
        payload: date
    }
}

export function selectConsultant(name) {
    return {
        type: SET_CONSULTANT_FILTER,
        payload: name
    }
}