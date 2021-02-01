import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import { Page, LoginScreenTitle, List, ListInput, ListButton, BlockFooter, Block, Preloader, Link } from 'framework7-react';

import { sendCreate } from '../Actions/createActions';
import {speakIntroduction} from '../components/textToSpeech'
import { userExists } from '../functions';
import './pages.css';

export const Create = props => {

    const dispatch = useDispatch();
    const username = useSelector(state => state.create.username);
    const pin = useSelector(state => state.create.pin);
    const loading = useSelector(state => state.create.loading);
    const warning = useSelector(state => state.create.warning);
    const step = useSelector(state => state.create.step);

    const submitEvent = async () => {
        dispatch({type: "SET_CREATE_WARNING", warning: ""})
        if (step === 1) {
            if (username) {
                if (await userExists(username) === false) {
                    if (username.length <= 20 && username.match(/^[a-z0-9]+$/i)) { //regex is voor a-z+0-9 only, dit is n beetje dubbel maar is voor 'enter' vs 'click' login
                        dispatch({type: "NEXT_CREATE_STEP"})
                    } else {
                        dispatch({type: "SET_CREATE_WARNING", warning: "'Gebruikersnaam' bevat illegale tekens"})
                    }
                } else {
                    dispatch({type: "SET_CREATE_WARNING", warning: "Die gebruikersnaam is al bezet"})
                }
            } else {
                dispatch({type: "SET_CREATE_WARNING", warning: "'Gebruikersnaam' mag niet leeg zijn"})
            }
        } else if (step === 2) {
            if (pin.length === 4 && pin.match(/^[0-9]*$/)) {
                if (username.length <= 20 && username.match(/^[a-z0-9]+$/i)) {
                    await dispatch(sendCreate(username, pin));
                    if (sessionStorage.username) { //username is only set on a successful create attempt,  so this checks if the create attempt was succesful
                        props.f7router.navigate("/bookshelf");
                    }
                } else {
                    dispatch({type: "SET_CREATE_WARNING", warning: "'Gebruikersnaam' bevat illegale tekens"})
                }
            } else {
                dispatch({type: "SET_CREATE_WARNING", warning: "'PIN' moet bestaan uit 4 cijfers"})
            }
        }
    }
    let speech;

	return (
        <Page loginScreen>

            <div id={'topbar-tts'} className={'topbar-tts'} 
            onClick={ step === 1 ?
                () => {
                    if(speech === undefined || !speech.speaking()){
                        speech = speakIntroduction('Vul een nieuwe gebruikersnaam in het veld "Je gebruikersnaam ..." en klik op de knop "Account aanmaken".')				
                    } else if(speech.speaking()){
                        speech.cancel()
                    }
                }
                    : 
                () => {
                    if(speech === undefined || !speech.speaking()){
                        speech = speakIntroduction('Vul een nieuwe pincode in het veld "XXXX" en klik op de knop "Account aanmaken".')
                    } else if(speech.speaking()){
                        speech.cancel()
                    }
            }}>				
                <i key={'speaker_2_fill'} id={'speaker_2_fill'} className="f7-icons">
                    {'speaker_2_fill'}
                </i>
		    </div>
            <LoginScreenTitle style={{fontSize: '5.5rem', padding: '1.5rem 0', maxWidth: '100%', fontWeight: "bold"}}>Readable Reader</LoginScreenTitle>
            
            <List className="previousbutton">
                {step > 1 && <ListButton onClick={() => dispatch({type: "PREVIOUS_CREATE_STEP"})}><i className="f7-icons">chevron_left</i>Terug</ListButton>}
            </List>

            <List form onSubmit={(e) => {
                e.preventDefault();
                submitEvent();
            }}
            style={{display: step === 1 ? "block" : "none"}}>
                <ListInput
                    label="Gebruikersnaam"
                    type="text"
                    placeholder="Je gebruikersnaam..."
					value={username}
                    required
					id="create_username-input"
                    maxlength="20"
                    onChange={ (event) => {
                        dispatch({type: "UPDATE_CREATE_USERNAME", username: event.target.value})
                    } }
                />
            </List>
            <List form onSubmit={(e) => {
                e.preventDefault();
                submitEvent();
            }}
            style={{display: step === 2 ? "block" : "none"}}>
                <ListInput
                    label={"PIN voor '" + username + "'"}
                    type="text"
                    placeholder="xxxx"
                    value={pin}
                    required
					id="create_pin-input"
                    maxlength="4"
                    onChange={ event => {
                        dispatch({type: "UPDATE_CREATE_PIN", pin: event.target.value})    
                    } }
                />
            </List>
			{loading && <Block className="text-align-center"><Preloader></Preloader></Block>}
            <List>
                {!loading && <ListButton onClick={submitEvent} id = "create-submit_button" style={{fontSize: '2.5rem', padding: '1.5rem 0'}}>Account aanmaken</ListButton>}
                {warning && <BlockFooter className="warning">{warning}</BlockFooter>}
                <BlockFooter>Heb je al een account? <Link href="/login">Log hier in.</Link></BlockFooter>
            </List>
        </Page>
	);
}