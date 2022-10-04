import axios from 'axios';

/**
* Create a new layout
* @param {Object} layout new layout
*/
export async function createLayout(layout) {
    try {
        const response = await axios.post(`/api/v1/layouts`, layout);
        return response.data;
    }

    catch (error) {
        window.alert('Something went wrong. We are working on a fix now!');
    }
}

/**
* Gets a list of layouts
* @param {string} query query string
*/
export async function getLayouts(query) {
    const q = (query) ? `?${query}` : '';
    try {
        const response = await axios.get(`/api/v1/layouts${q}`);
        return response.data;
    }

    catch (error) {
        window.alert('Something went wrong. We are working on a fix now!');
    }
}

/**
* Updates a layout
* @param {Object} layout layout update
*/
export async function updateLayout(id, update) {
    try {
        const response = await axios.put(`/api/v1/layouts/${id}`, update);
        return response.data;
    }

    catch (error) {
        window.alert('Something went wrong. We are working on a fix now!');
    }
}

/**
* Deletes a layout
* @param {string} id layout id
*/
export async function deleteLayout(id) {
    try {
        const response = await axios.delete(`/api/v1/layouts/${id}`);
        return response.data;
    }

    catch (error) {
        window.alert('Something went wrong. We are working on a fix now!');
    }
}