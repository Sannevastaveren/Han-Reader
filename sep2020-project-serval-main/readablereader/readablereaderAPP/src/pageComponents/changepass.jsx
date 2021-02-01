import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import { Page, LoginScreenTitle, List, ListInput, ListButton, BlockFooter, Block, Preloader } from 'framework7-react';
import {speakIntroduction} from '../components/textToSpeech'
import { changePassword } from '../Actions/changepassActions';

import { TabbarBottom, TabbarPopup, DialogAlert } from "../components/components";

export const Changepass = props => {

    const dispatch = useDispatch();
    const pin = useSelector(state => state.changepass.pin);
    const newPin = useSelector(state => state.changepass.newPin);
    const newPinRepeat = useSelector(state => state.changepass.newPinRepeat);
    const warning = useSelector(state => state.changepass.warning);
    const loading = useSelector(state => state.changepass.loading);
    const step = useSelector(state => state.changepass.step);
	const showModal = useSelector(state => state.changepass.showModal);
    
    if (!sessionStorage.username) {
        props.f7router.navigate("/login");
    }

    const submitEvent = async () => {
        dispatch({type: "SET_CHANGEPASS_WARNING", warning: ""})
        if (step >= 3) {
            if ((pin && newPin) && newPin === newPinRepeat) {
                if (newPin.length === 4 && newPin.match(/^[0-9]*$/)) {
                    await dispatch(changePassword(sessionStorage.username, pin, newPin));
                } else {
                    dispatch({type: "SET_CHANGEPASS_WARNING", warning: "Nieuwe PIN moet bestaan uit 4 cijfers"})
                }
            } else {
                if (!pin) {
                    dispatch({type: "SET_CHANGEPASS_WARNING", warning: "Vul je oude PIN in"})
                } else if (!newPin) {
                    dispatch({type: "SET_CHANGEPASS_WARNING", warning: "Vul een nieuwe PIN in"})
                } else if (newPin !== newPinRepeat) {
                    dispatch({type: "SET_CHANGEPASS_WARNING", warning: "Nieuwe PIN en herhaalde PIN zijn niet hetzelfde."})
                }
            }
        } else {
            dispatch({type: "NEXT_CHANGEPASS_STEP"})
        }
    }
    let speech;

	return (
        <Page loginScreen>
            <div id={'topbar-tts'} className={'topbar-tts'} onClick={ step === 1 ? 
                    () => {
                        if(speech === undefined || !speech.speaking()){
                            speech = speakIntroduction('Voer je oude pincode in, waar "XXXX" staat en klik op "Verander wachtwoord"') 
                        } else if (speech.speaking()){
                            speech.cancel()
                        }
                    } :
                    () => {
                        if(speech === undefined || !speech.speaking()){
                            speech = speakIntroduction('Voer je nieuwe pincode in en klik op "Verander wachtwoord".')
                        } else if(speech.speaking()){
                            speech.cancel()
                        }
            }}>					
				<i key={'speaker_2_fill'} id={'speaker_2_fill'} className="f7-icons">
					{'speaker_2_fill'}
				</i>
			</div>
            <LoginScreenTitle style={{fontSize: '6rem', padding: '1.5rem 0', maxWidth: '90%'}}>Wachtwoord Veranderen</LoginScreenTitle>

			<DialogAlert title="Gelukt!" text="Je wachtwoord is veranderd." show={showModal} hide={() => { dispatch({ type: "SET_CHANGEPASS_MODAL", showModal: false }); props.f7router.navigate("/account"); }}></DialogAlert>

            <List form onSubmit={(e) => {
                e.preventDefault();
                if (!pin) {
                    dispatch({type: "SET_CHANGEPASS_WARNING", warning: "Vul je oude PIN in"})
                } else {
                    dispatch({type: "NEXT_CHANGEPASS_STEP"})
                }
            }}
            style={{display: step === 1 ? "block" : "none"}}>
                <ListInput
                    label="Oude PIN"
                    type="text"
                    placeholder="xxxx"
					value={pin}
                    required
					id="login_pin-input"
                    maxlength="4"
                    onChange={ (event) => {
                        dispatch({type: "UPDATE_CHANGEPASS_PIN", pin: event.target.value})
                    } }
                />
            </List>
            
            <List form onSubmit={(e) => {
                e.preventDefault();
                if (!newPin) {
                    dispatch({type: "SET_CHANGEPASS_WARNING", warning: "Vul je nieuwe PIN in"})
                } else {
                    dispatch({type: "NEXT_CHANGEPASS_STEP"})
                }
            }}
            style={{display: step === 2 ? "block" : "none"}}>
                <ListInput
                    label="Nieuwe PIN"
                    type="text"
                    placeholder="yyyy"
					value={newPin}
                    required
					id="login_pin-input"
                    maxlength="4"
                    onChange={ (event) => {
                        dispatch({type: "UPDATE_CHANGEPASS_NEWPIN", pin: event.target.value})
                    } }
                />
            </List>
            
            <List form onSubmit={(e) => {
                e.preventDefault();
                submitEvent();
            }}
            style={{display: step === 3 ? "block" : "none"}}>
                <ListInput
                    label="Herhaal PIN"
                    type="text"
                    placeholder="yyyy"
					value={newPinRepeat}
                    required
					id="login_pin-input"
                    maxlength="4"
                    onChange={ (event) => {
                        dispatch({type: "UPDATE_CHANGEPASS_NEWPINREPEAT", pin: event.target.value})
                    } }
                />
            </List>

			{loading && <Block className="text-align-center"><Preloader></Preloader></Block>}

            <List>
                {!loading && <ListButton onClick={submitEvent} id = "login-submit_button" style={{fontSize: '2.5rem', padding: '1.5rem 0'}}>Verander Wachtwoord</ListButton>}
                {warning && <BlockFooter className="warning">{warning}</BlockFooter>}
            </List>
			
			<TabbarPopup />
            <TabbarBottom/>
        </Page>
	);
}