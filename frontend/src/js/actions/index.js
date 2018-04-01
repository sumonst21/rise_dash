import axios from 'axios';

const API_URL = `${process.env.BASE_API_URL}/form_data/`;
// const API_URL = 'https://api.appmachine.com/v1/data/';
// const API_URL = 'http://localhost:8081/api/form_data/';

export const FETCH_FILTERS = 'FETCH_FILTERS';


function getHeaders () {
    return {
        'Authorization': `Token ${localStorage.token}`,
    }
}

export function fetchFilters() {
    const url = `${API_URL}`;
    const request = axios.get(url, {headers: getHeaders()});
    return {
        type: FETCH_FILTERS,
        payload: request
    }
}
