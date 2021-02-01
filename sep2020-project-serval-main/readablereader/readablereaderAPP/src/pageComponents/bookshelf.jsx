import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import {speakIntroduction} from '../components/textToSpeech'
import { Page, Block, Preloader } from 'framework7-react';
import { BookList, TabbarBottom, TabbarPopup, DialogAlert, PreloaderModal } from "../components/components";
import { getBooks } from '../Actions/bookshelfActions';
import { websocket } from "../Actions/websocketActions";
import { uploadBookFileAction, uploadHandlerAction } from '../Actions/FileActions';
import {loadPreferences} from '../Actions/bookActions';

export const Bookshelf = props => {

	const dispatch = useDispatch();
	const status = useSelector(state => state.bookshelf.status);
	const loading = useSelector(state => state.bookshelf.loading);
	const books = useSelector(state => state.bookshelf.books);
	const ws = useSelector(state => state.login.ws);
	const state_alert = useSelector(state => state.file.alert);
	const state_error = useSelector(state => state.file.error);
	const state_uploadedBook = useSelector(state => state.file.uploadedBook);
	
    if (!sessionStorage.username) {
		props.f7router.navigate("/login");
    }
	
	if (status === "unloaded" && !loading) {
		dispatch(getBooks())
		// dispatch(loadPreferences())
	}
	if (!ws){
		dispatch(websocket())
	}
	// for pull to refresh, retrieves books and lets pullToRefresh know when it's done
	const reload = async done => {
		await dispatch(getBooks());
		done();
	}
	let speech;

	return (
        <Page name="bookshelf" ptr onPtrRefresh={reload.bind(this)} >

			<div id={'topbar-tts'} className={'topbar-tts'} 
			onClick={() => {
				if(speech === undefined || !speech.speaking()){
					speech = speakIntroduction('Klik op het boek dat je wil lezen, klik op de groene plus knop om een boek toe te voegen, of klik op de blauwe knop rechts onder om het menu te tonen.')
					speech = speakIntroduction('Swipe naar links op het boek om het boek te verwijderen en swipe naar rechts om de titel en de auteur voor te laten lezen.')
				} else if(speech.speaking()){
					speech.cancel()
				}
			}}>				
				<i key={'speaker_2_fill'} id={'speaker_2_fill'} className="f7-icons">
					{'speaker_2_fill'}
				</i>
			</div>
		    <BookList books={books} loading={loading}></BookList>
			{loading && <Block className="text-align-center"><Preloader></Preloader></Block>}

			<PreloaderModal title="Uploaden..." show={(state_uploadedBook.status === "uploading") ? true : false}></PreloaderModal>

			<DialogAlert title={state_alert.title} text={state_alert.text} show={state_alert.show} hide={() => { dispatch({ type: "alertModalShow", action: false });  }}></DialogAlert>

			<DialogAlert title={'Fout'} text={state_error.message} show={state_error !== null && state_error.for === 'file'} hide={() => { dispatch({ type: "uploadBookErrorMessage", error: null });}} ></DialogAlert>
			
				<div className="addbookbutton">
					<input id="button_upload" type='file' accept='.epub' onChange={(e) => {dispatch(uploadBookFileAction(e.target.files[0])); dispatch(uploadHandlerAction())}} hidden />
					<label for="button_upload" >
						<i className="f7-icons">plus</i>
					</label>
				</div>
			
			<TabbarPopup />
            <TabbarBottom/>
        </Page>
	);
}

