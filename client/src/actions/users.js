import axios from 'axios';

/**
* Creates a new user
* @param {Object} user new user
*/
export async function createUser(user) {
    try {
        const response = await axios.post(`/api/v1/users/signup`, user);
        localStorage.setItem(`${window.location.origin}-token`, response.data.token);
        return response;
    }

    catch (error) {
        window.alert('Something went wrong. We are working on a fix now!');
    }
}

/**
* Authenticates a new user
* @param {Object} user user credentials
*/
export async function login(user) {
    try {
        const response = await axios.post(`/api/v1/users/login`, user);
        if (!response.data.error) {
            localStorage.setItem(`${window.location.origin}-token`, response.data.token);
        }
        
        return response;
    }

    catch (error) {
        window.alert('Invalid email or password');
    }
}

/**
* Logs a user out
*/
export function logout() {
    localStorage.removeItem(`${window.location.origin}-token`);
    window.location.href = `${window.location.origin}`;
}