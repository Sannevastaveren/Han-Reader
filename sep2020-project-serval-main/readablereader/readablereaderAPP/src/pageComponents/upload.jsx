import * as ReactRedux from 'react-redux';

import { uploadBookFileAction, uploadHandlerAction } from '../Actions/FileActions';

import { Page, Navbar, ListInput, Icon, List, BlockTitle, Button, Block } from 'framework7-react';

import { PreloaderModal, DialogAlert, TabbarBottom, TabbarPopup } from '../components/components';

import {speakIntroduction} from '../components/textToSpeech'

export const Upload = props => {

	const dispatch = ReactRedux.useDispatch();
	const state_uploadedBook = ReactRedux.useSelector(state => state.file.uploadedBook);
	const state_error = ReactRedux.useSelector(state => state.file.error);
	const state_alert = ReactRedux.useSelector(state => state.file.alert);
	const showMenu = ReactRedux.useSelector(state=>state.component.showMenu);

    if (!sessionStorage.username) {
        props.f7router.navigate("/login");
	}
	
	const navBar = showMenu ? <Navbar title="Upload" hidden></Navbar> : <Navbar title="Upload"></Navbar>
	let speech;
	return (
		<Page name="upload">
			{navBar}
			<div id={'topbar-tts-left-bottom'} className={'topbar-tts-left-bottom'} 
			onClick={() => {
				if(speech === undefined || !speech.speaking()){
					speech = speakIntroduction('Klik op "Bestand kiezen" om een epub bestand te uploaden. Selecteer het bestand en druk op de blauwe balk "Upload".')
				} else if(speech.speaking()){
					speech.cancel()
				}
				}}>				
				<i key={'speaker_2_fill'} id={'speaker_2_fill'} className="f7-icons">
					{'speaker_2_fill'}
				</i>
			</div>
			<PreloaderModal title="Uploaden..." show={(state_uploadedBook.status === "uploading") ? true : false}></PreloaderModal>

			<DialogAlert title={state_alert.title} text={state_alert.text} show={state_alert.show} hide={() => { dispatch({ type: "alertModalShow", action: false }); if (state_uploadedBook.status === "uploaded") { props.f7router.navigate("/bookshelf"); } }}></DialogAlert>

			<BlockTitle style={{padding: '1.5rem 0', marginTop: '5rem'}}>Kies een boek dat je wilt uploaden</BlockTitle>
			<List inlineLabels noHairlinesMd>
				<ListInput 
					label="Bestand"
					type="file"
					info=".epub bestandstype"
					accept='.epub'
					errorMessage={state_error.message}
					errorMessageForce={state_error !== null && state_error.for === 'file'}
					onChange={(e) => dispatch(uploadBookFileAction(e.target.files[0]))}

				>
					<Icon f7="cloud_upload" slot="media" style={{fontSize: '70px'}}/>
				</ListInput>
			</List>
			<Block>
				<Button id='uploadBook' fill large onClick={()=>dispatch(uploadHandlerAction())} style={{fontSize: '4rem', height: '6rem', padding: '1.5rem 0', fontWeight: "700"}}>Upload</Button>
			</Block>
			<TabbarPopup />
            <TabbarBottom/>
		</Page>
	);
}
