import { googleSignIn, googleSignedIn, googleUserVerified, getUsernameFromEmail } from '../functions';
import { apiURL } from '../index';

const FormData = require('form-data');
const bcrypt = require('bcryptjs');

export const sendLogin = (username, pin, GoogleUser) => {
    return async (dispatch) => {

		dispatch({type: "SET_LOGIN_LOADING", loading: true})

		sessionStorage.clear();

        try {

            const request = await fetch(`${apiURL}/users/${username}/`, {
                method: "GET",
                headers: [],
				credentials: 'include',
            })

            const response = await request.text();
			const user = JSON.parse(response);
			
            if (!user.success) {
				if (GoogleUser !== undefined) {
					const loginData = new FormData();
                
					loginData.append('username', username);
					loginData.append('google', (GoogleUser!==undefined));
					loginData.append('googleToken', GoogleUser.getAuthResponse().id_token);
	
					await fetch(`${apiURL}/users/`, {
						method: "POST",
						body: loginData
					})
	
					sessionStorage.username = username;
					window.location.href = "/bookshelf";
				} else {
					dispatch({type: "SET_WARNING", warning: "Gebruikersnaam of pincode is onjuist."})
				}
            } else {
				if ( user.google===true ) {
					switch (googleSignedIn()) {
						case true:
							// google is ingelogd
							// huidige persoon die ingelogd is is niet degene waarmee geprobeerd wordt in te loggen

							// console.log(await googleUserVerified( GoogleUser, user.googleToken ))
							//googleCurrentlySignedIn() === username &&
							if ( await googleUserVerified( GoogleUser, user.googleToken )) {
								// google is ingelogd
								sessionStorage.username = username;
								window.location.href = "/bookshelf";
								break;
							}
						case false:
							// google niet ingelogd
							dispatch({type: "SET_WARNING", warning: "Jouw account is een google account dus login met google."})

							const googleUser = await googleSignIn();

							// vraag user om in te loggen
							dispatch(sendLogin(getUsernameFromEmail(googleUser.profileObj.email), "none", googleUser));
							// } else {
							// 	dispatch({type: "SET_WARNING", warning: "Jouw usertokens kloppen niet."})
							// }
							break;
						default:
							break;
					}
 				} else {
					if (GoogleUser===undefined) {
						if (bcrypt.compareSync(pin, user.pin)) { //compare hash with users input, if true login succesful
							dispatch({type: "RESET_LOGIN_PAGE"})
							sessionStorage.username = user.username;
						} else {
							dispatch({type: "SET_WARNING", warning: "Gebruikersnaam of pincode is onjuist"})
						}
					} else {
						dispatch({type: "SET_WARNING", warning: "Het account waarop je probeerd in te loggen is niet gekoppeld aan jou google account"})
						dispatch({type: "UPDATE_GOOGLECHOOSEUSERNAME", googleChooseUsername: true})
					}
				}
            }
            
            dispatch({type: "SET_BOOKSHELF_STATUS", status: "unloaded"})
            dispatch({type: "SET_LOGIN_LOADING", loading: false})

        } catch(err) {
            dispatch({type: "SET_WARNING", warning: "Er is iets mis gegaan met de connectie naar de server"})
            console.log(err)
        }
    }
}

// export const sendGoogleLogin = (GoogleUser) => {
// 	return async dispatch => {
// 		const id_token = GoogleUser.getAuthResponse().id_token;

// 		const request = await (await fetch(`http://localhost:3001/api/v1/users/googlesignin?idtoken=${id_token}`, {
// 			method: "post"
// 		})).json();

// 		if (request.success) {
// 			// sessionStorage.username = username;
// 			// window.location.href = "/bookshelf";
// 		}
// 	}
// }