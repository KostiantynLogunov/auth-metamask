import axios from 'axios'
import { setAuthorization } from "./general";

export function login(credentials) {
    return new Promise((res, rej) => {
        axios.post('http://localhost:3000/api/signin', credentials, {})
            .then((response) => {
                setAuthorization(response.data.token);
                res(response.data);
            })
            .catch((err) => {
                rej('Something wrong in auth...');
            })
    });
}

export function getLocalUser() {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
        return null;
    }

    return JSON.parse(userStr);
}
