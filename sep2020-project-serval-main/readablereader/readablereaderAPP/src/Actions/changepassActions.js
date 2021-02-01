import { apiURL } from '../index';

const FormData = require('form-data');
const bcrypt = require('bcryptjs');

export const changePassword = (username, oldPin, newPin) => {
    return async (dispatch) => {

		dispatch({type: "SET_CHANGEPASS_LOADING", loading: true})

        try {

            const request = await fetch(`${apiURL}/users/${username}/`, {
                method: "GET",
                headers: [],
				credentials: 'include',
            })

            const response = await request.text();
            const user = JSON.parse(response);
			
            if (bcrypt.compareSync(oldPin, user.pin)) { //compare hash with users input
                const saltRounds = 12;
                const hashedPin = bcrypt.hashSync(newPin, saltRounds);

                const newData = new FormData();
                
                newData.append('pin', hashedPin);

                await fetch(`${apiURL}/users/${username}/pin`, {
                    method: "PUT",
                    body: newData
                })
                
                dispatch({ type: "RESET_CHANGEPASS_PAGE" })
                dispatch({ type: "SET_CHANGEPASS_MODAL", showModal: true })
            } else {
                dispatch({ type: "RESET_CHANGEPASS_PAGE" })
                dispatch({type: "SET_CHANGEPASS_WARNING", warning: "De oude pincode is onjuist"})
            }
        } catch(err) {
            console.log(err)
        }

        dispatch({type: "SET_CHANGEPASS_LOADING", loading: false})
    }
}