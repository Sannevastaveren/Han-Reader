import React from "react";
import { useDispatch } from 'react-redux';

import { Page, Button } from 'framework7-react';

import { useGoogleLogin, useGoogleLogout, GoogleLogin, GoogleLogout } from 'react-google-login';

import { sendLogin } from '../Actions/loginActions';

const client_id = require("../config").client_id;

const fetch = require('node-fetch');

// const client_id = "739334429939-ov4o8kej3s0urd16v2d19uflk8s7avm2.apps.googleusercontent.com";

const responseGoogle = (response) => {
	console.log(response);
}

export const Testlogin = props => {

	const dispatch = useDispatch();

	const { signIn } = useGoogleLogin({
		onSuccess: onSignIn,
		clientId: client_id,
		cookiePolicy: 'single_host_origin',
		onFailure: responseGoogle
	})

	const { signOut } = useGoogleLogout({
		onFailure: (r) => console.log(`failed: ${r}`),
		clientId: client_id,
		cookiePolicy: 'single_host_origin',
		onLogoutSuccess: (r) => console.log(`succes: ${r}`)
	})

	async function onSignIn(googleUser) {
		const id_token = googleUser.getAuthResponse().id_token;
		const googleUserCheck = await verifyGoogleUser(id_token);
 
		if ( googleUserCheck.status === false ) return;
		const user = googleUserCheck.data;
		
		await dispatch(sendLogin(await getUsernameFromEmail(user.email), true));

		if (sessionStorage.username) { //username is only set on a successful login attempt,  so this checks if the login attempt was succesful
			props.f7router.navigate("/bookshelf");
		}
	}

	return (
		<Page>
			<GoogleLogin
				clientId={client_id}
				buttonText="Login"
				onSuccess={onSignIn}
				onFailure={responseGoogle}
				cookiePolicy={'single_host_origin'}
			/>
			<GoogleLogout
				clientId={client_id}
				buttonText="Logout"
				onLogoutSuccess={responseGoogle}
			>
			</GoogleLogout>
			<Button onClick={signIn}>Login</Button>
			<Button onClick={signOut}>Logout</Button>
		</Page>
	);
}

const getUsernameFromEmail = email => email.split('@')[0];

const verifyGoogleUser = async (id_token) => {
	const tokenCheck = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
	const userInfo = await tokenCheck.json();
	const verified = userInfo.aud===client_id;

	// googleLoggedIn geeft aan of een persoon succesvol is ingelogd met google.
	sessionStorage.googleLoggedIn = verified;

	return {
		succes: verified,
		data: (verified) ? userInfo : {}
	}
}