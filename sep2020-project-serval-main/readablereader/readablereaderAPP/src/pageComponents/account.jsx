import React from "react";
import { useSelector } from 'react-redux';

import { Page, Navbar, BlockTitle, List, ListItem } from 'framework7-react';
import { TabbarBottom, TabbarPopup } from "../components/components";
import {speakIntroduction} from "../components/textToSpeech"

export const Account = props => {

	// const dispatch = useDispatch();
	const showMenu = useSelector(state=>state.component.showMenu);
	
    if (!sessionStorage.username) {
        props.f7router.navigate("/login");
    }

	const navBar = showMenu ? <Navbar title="Account" hidden></Navbar> : <Navbar title="Account"></Navbar>

    let speech;
	return (
        <Page name="account">

			{navBar}
            <div id={'topbar-tts-left-bottom'} className={'topbar-tts-left-bottom'} 
			onClick={() => {
                if(speech === undefined || !speech.speaking()){
                    speech = speakIntroduction('Klik op wachtwoord veranderen om je wachtwoord te veranderen en klik op uitloggen om uit te loggen')
                } else if(speech.speaking()){
                    speech.cancel()
                }
                }}>				
				<i key={'speaker_2_fill'} id={'speaker_2_fill'} className="f7-icons">
					{'speaker_2_fill'}
				</i>
			</div>

            <BlockTitle style={{fontSize: '4rem', textAlign: "center", padding: '2rem 0', margin: "8rem auto", maxWidth: '80%'}}>{sessionStorage.username}</BlockTitle>

            <List>
                <ListItem title="Wachtwoord Veranderen" link={`/changepass/`}></ListItem>
            </List>

            <List>
                <ListItem title="Uitloggen" link={`/logout/`}></ListItem>
            </List>
			
			<TabbarPopup />
            <TabbarBottom/>
        </Page>
	);
}

