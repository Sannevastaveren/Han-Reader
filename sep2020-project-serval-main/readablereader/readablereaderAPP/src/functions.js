import ePub from 'epubjs';
import defaultImage from './components/default.png';
import { apiURL } from './index';

const client_id = require('./config').client_id;
const fetch = require('node-fetch');

export const getBookData = async (bookFile) => {
	const epub = ePub(bookFile);
	const response = {};

	response.cover = await(await fetch(await epub.coverUrl())).blob();
	response.metadata = await epub.loaded.metadata;

	return response;
}

// 1. verkrijg de cover via de api
// 2. zet de image om naar een blob
// 3. verkrijg de url van de blob
// returnt de url van de blob
export const getBookCover = async (bookid) => {
	const response = await fetch(`http://localhost:3001/api/v1/books/${bookid}/cover`);
	return (response.status === 200) ? await (URL.createObjectURL(await (response).blob())) : defaultImage;
}
// google functions

// De functie initializeert de gapi (google api) auth2
// @returns gapi.auth2.GoogleAuth
export const googleInit = () => {
	// checkt of auth2 al init is.
	return (window.gapi.auth2.getAuthInstance()===null)
	? window.gapi.auth2.init({
		client_id: client_id
	})
	: window.gapi.auth2.getAuthInstance();
}

// Deze functie prompt de google login.
// roept dan met GoogleUser de googleOnSignIn aan.
export const googleSignIn = async () => {
	try {
		const GoogleUser = await window.gapi.auth2.getAuthInstance().signIn();
		// return googleOnSignIn(GoogleUser);
		return GoogleUser;
	} catch (err) {
		console.log(err);
	}
}

// Deze functie init google omdat anders auth2 undefined is
// logt vervolgens de google kant uit
export const googleSignOut = async () => {
	const googleauth = await googleInit();
	return googleauth.signOut();
}

// Deze functie returnt of er iemand ingelogd is
// @returns boolean
export const googleSignedIn = () => {
	return window.gapi.auth2.getAuthInstance().isSignedIn.get();	
}

// @@returns username of currently signed in
export const googleCurrentlySignedIn = () => {
	return getUsernameFromEmail(window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().cu);
}

// deze functie pakt het deel voor de @ van een email.
export const getUsernameFromEmail = email => email.split('@')[0];


// Deze functie verified de token van de user bij google.
// @returns Object
const verifyGoogleUser = async (id_token) => {
	const tokenCheck = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
	const userInfo = await tokenCheck.json();
	const verified = userInfo.aud===client_id;
	return {
		succes: verified,
		data: (verified) ? userInfo : {}
	}
}

// Deze functie verwacht een GoogleUser
// checkt dan of de user token klopt.
// @returns username
// export const googleOnSignIn = async (GoogleUser, googleToken) => {
// 	const id_token = GoogleUser.getAuthResponse().id_token;
// 	const googleUserCheck = await verifyGoogleUser(id_token);

// 	if ( googleUserCheck.status === false ) return;
// 	if (id_token!==googleToken) return;

// 	const user = googleUserCheck.data;

// 	return getUsernameFromEmail(user.email)
// }

export const googleUserVerified = async ( GoogleUser, dbToken ) => {
	const id_token = GoogleUser.getAuthResponse().id_token;
	const googleUserCheck = await verifyGoogleUser(id_token);
	if ( googleUserCheck.status === false ) return false;

	// nieuwe user
	if ( dbToken !== undefined && id_token!==dbToken ) return false;

	
	return true;	
}

// Check of @pin alleen bestaat uit nummers.
// Return is een boolean.

export const pinOnlyHasNumbers = pin => {
    return pin.match(/^[0-9]*$/);
}

export const userExists = async username => {
    const request = await fetch(`${apiURL}/users/${username}/`, {
		method: "GET",
		headers: [],
		credentials: 'include',
	})

	const response = await request.text();
	const user = JSON.parse(response);
	return user.success;
}
