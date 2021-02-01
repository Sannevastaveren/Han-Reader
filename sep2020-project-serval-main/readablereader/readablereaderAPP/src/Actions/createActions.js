// import { googleSignIn, googleSignedIn, googleCurrentlySignedIn } from '../functions';
import { apiURL } from '../index';

const FormData = require('form-data');
const bcrypt = require('bcryptjs');

export const sendCreate = (username, pin, google=false) => {
    return async (dispatch) => {

		dispatch({type: "SET_CREATE_LOADING", loading: true})

		sessionStorage.clear();

        try {

            const request = await fetch(`${apiURL}/users/${username}/`, {
                method: "GET",
                headers: []
            })

            const response = await request.text();
			const user = JSON.parse(response);
			
            if (!user.success) {

                const saltRounds = 12; //not entirely sure how this works, but basically more rounds = more secure but also more slow. 10-12 was recommended online a few years ago
                const hashedPin = bcrypt.hashSync(pin, saltRounds);

                const loginData = new FormData();
                
                loginData.append('username', username);
                loginData.append('pin', hashedPin);
                loginData.append('google', google);

                await fetch(`${apiURL}/users/`, {
                    method: "POST",
                    body: loginData
                })

                
                dispatch({type: "RESET_CREATE_PAGE"});
				sessionStorage.username = username;
				window.location.href = "/bookshelf";

            } else {
				dispatch({type: "SET_CREATE_WARNING", warning: `De naam '${user.username}' is al bezet.`})
            }
            
            dispatch({type: "SET_BOOKSHELF_STATUS", status: "unloaded"})
            dispatch({type: "SET_CREATE_LOADING", loading: false})

        } catch(err) {
            dispatch({type: "SET_CREATE_WARNING", warning: "Er is iets mis gegaan met de connectie naar de server"})
        }
    }
}