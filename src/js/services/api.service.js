import config from '../config/api.config';

const baseUrl = config.baseUrl;

/**
 * Function sendForm. Make a request to API.
 *
 */
export function sendForm(method, url, data) {
    return fetch(baseUrl + url, {
        method: method,
        body: data,
        
    }).then((res) => {
        return res.json();
    }).catch((err) => {
        console.error(err);
        return Promise.reject(err);
    })
}