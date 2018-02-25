import axios from 'axios';


const API_URL = `${process.env.BASE_API_URL}/obtain_auth_token/`;


function loggedIn () {
    return !!localStorage.token
}

function logout () {
    delete localStorage.token
}

function getToken (username, pass, cb) {
    const data = {
        "username": username,
        "password": pass
    };

    axios.post(API_URL, data).then(
        function (response) {
            console.log(response);
            cb({
                authenticated: true,
                token: response.data.token
            })
        }
    )
}

function login (username, pass, cb) {
    if (localStorage.token) {
        if (cb) cb(true);
    }
    else {
        getToken(username, pass, (response) => {
            if (response.authenticated) {
                localStorage.token = response.token;
                if (cb) cb(true)
            } else {
                if (cb) cb(false)
            }
        })
    }
}

export {loggedIn, login, logout};