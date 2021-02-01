import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import { Page, LoginScreenTitle, List, ListInput, ListButton, BlockFooter, Block, Preloader, Link } from 'framework7-react';

import { sendLogin } from '../Actions/loginActions';

import { GoogleLogin } from 'react-google-login';

import { getUsernameFromEmail, googleInit } from '../functions';

import { DialogPrompt } from '../components/components';

import './pages.css';
import { speakIntroduction } from "../components/textToSpeech";

const client_id = require("../config").client_id;

export const Login = props => {

    const dispatch = useDispatch();
    const username = useSelector(state => state.login.username);
    const pin = useSelector(state => state.login.pin);
    const loading = useSelector(state => state.login.loading);
    const warning = useSelector(state => state.login.warning);
    const step = useSelector(state => state.login.step);
    const googleChooseUsername = useSelector(state => state.login.googleChooseUsername);

    if (!sessionStorage.username) {
        props.f7router.navigate("/login");
    }

    const submitEvent = async () => {
        if (step >= 2) {
            dispatch({ type: "SET_WARNING", warning: "" })
            if (username && pin) {
                await dispatch(sendLogin(username, pin));
                if (sessionStorage.username) { //username is only set on a successful login attempt,  so this checks if the login attempt was succesful
                    props.f7router.navigate("/bookshelf");
                }
            } else {
                if (!pin) {
                    dispatch({ type: "SET_WARNING", warning: "'pin' mag niet leeg zijn" })
                }
            }
        } else {
            if (!username) {
                dispatch({ type: "SET_WARNING", warning: "'gebruikersnaam' mag niet leeg zijn" })
            } else {
                dispatch({ type: "NEXT_LOGIN_STEP" })
            }
        }
    }

    // functie wordt aangeroepen als er succesvol met google is ingelogd
    async function onSignIn(googleUser) {
        // vraag user om in te loggen
        dispatch(sendLogin(getUsernameFromEmail(googleUser.profileObj.email), "none", googleUser));
    }
    let speech;

    return (
        <Page loginScreen>

            {
                (googleChooseUsername && <DialogPrompt value={username} onInput={event => dispatch({ type: "UPDATE_USERNAME", username: event.target.value })} onAccept={() => dispatch(sendLogin(username, "none", googleInit().currentUser.get()))} onCancel={() => console.log('c')} />)
            }

            <div id={'topbar-tts'} className={'topbar-tts'} onClick={step === 1 ?
                () => {
                    if (speech === undefined || !speech.speaking()) {
                        speech = speakIntroduction('Vul je gebruikersnaam in het veld "Je gebruikersnaam ..." en klik op de knop "Login".')
                        speech = speakIntroduction('Óf login met Google door op de witte balk "Inloggen met Google" te klikken.')
                    } else if (speech.speaking()) {
                        speech.cancel()
                    }
                } :
                () => {
                    if (speech === undefined || !speech.speaking()) {
                        speech = speakIntroduction('Vul je pincode in het veld "XXXX" en klik op de knop "Login".')
                    } else if (speech.speaking()) {
                        speech.cancel()
                    }
                }}>
                <i key={'speaker_2_fill'} id={'speaker_2_fill'} className="f7-icons">
                    {'speaker_2_fill'}
                </i>
			</div>
            <LoginScreenTitle style={{fontSize: 'var(--fontSize-header)', padding: '1.5rem 0', maxWidth: '100%', fontWeight: "bold"}}>Readable Reader</LoginScreenTitle>
            <List className="previousbutton">
                {step > 1 && <ListButton onClick={() => dispatch({ type: "PREVIOUS_LOGIN_STEP" })}><i className="f7-icons">chevron_left</i>Terug</ListButton>}
            </List>
            {step === 1 && (<List form onSubmit={(e) => {
                e.preventDefault();
                if (!username) {
                    dispatch({ type: "SET_WARNING", warning: "'gebruikersnaam' mag niet leeg zijn" })
                } else {
                    dispatch({ type: "NEXT_LOGIN_STEP" })
                }
            }}
                style={{ display: step === 1 ? "block" : "none" }}>
                <ListInput
                    label="Gebruikersnaam"
                    type="text"
                    placeholder="Je gebruikersnaam..."
                    value={username}
                    required
                    autofocus
                    id="login_username-input"
                    onChange={(event) => {
                        dispatch({ type: "UPDATE_USERNAME", username: event.target.value })
                    }}
                />
            </List>)}
            <List form onSubmit={(e) => {
                e.preventDefault();
                submitEvent();
            }}
                style={{ display: step === 2 ? "block" : "none" }}>
                <ListInput
                    label={"PIN voor '" + username + "'"}
                    type="text"
                    placeholder="xxxx"
                    value={pin}
                    required
                    autofocus
                    id="login_pin-input"
                    maxlength="4"
                    onChange={(event) => {
                        dispatch({ type: "UPDATE_PIN", pin: event.target.value })
                    }}
                />
            </List>
            {loading && <Block className="text-align-center"><Preloader></Preloader></Block>}
            <List>
                {!loading && <ListButton onClick={submitEvent} id="login-submit_button" style={{ fontSize: '2.5rem', padding: '1.5rem 0' }}>Log in</ListButton>}
                {warning && <BlockFooter className="warning">{warning}</BlockFooter>}
                <div style={{ maxWidth: 'max-content', margin: '1vh auto' }}>
                    <GoogleLogin
                        clientId={client_id}
                        buttonText="Inloggen met google"
                        onSuccess={onSignIn}
                        onFailure={() => dispatch({ type: "SET_WARNING", warning: "Er is iets misgegaan bij het ingeloggen met google" })}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
                <BlockFooter>Heb je nog geen account? <Link href="/create">Maak hier een account aan.</Link></BlockFooter>
            </List>
        </Page>
    );
}