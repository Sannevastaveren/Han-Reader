import {getBookData} from '../functions';
import { apiURL } from '../index';

const fetch = require('node-fetch');
const FormData = require('form-data');

export function uploadHandlerAction() {
	return async (dispatch, getState) => {
		const state = getState();
		const state_uploadedBook = state.file.uploadedBook;

		// if uploaded book is not a book
		if (typeof state_uploadedBook.uploadedBook === 'string') {
			dispatch({ type: 'uploadBookErrorMessage', error: { for: 'file', message: 'Upload een epub bestand!' } });
			return;
		}
		// checkt dat het bestandstype .epub is.
		if (!state_uploadedBook.uploadedBook.name.match(/^.*\.(epub)$/g)) {
			dispatch({ type: 'uploadBookErrorMessage', error: { for: 'file', message: 'Het geuploade bestand moet .epub zijn!' } });
			return;
		}
	
		// zet de error op null
		dispatch({ type: 'uploadBookErrorMessage', error: { for: null, message: null } });
	
		const bookData = {
			file: state_uploadedBook.uploadedBook
		}
	
		dispatch({ type: "uploadBookStatus", status: "uploading" });
	
		dispatch(uploadFileAction(bookData));
	}
}

// Main Actions:

export function resetStatusAction() {
    return { type: "resetStatusAction" };
}

export function uploadFileAction(book) {
    return async (dispatch) => {
        // formData regelt het sturen van het bestand
        const formData = new FormData();
		formData.append('username', sessionStorage.username);
		formData.append('file', book.file);

		const bookData = await getBookData(book.file);

		// misschien moet dit gecheckt worden zodat je hier default data in kan stoppen
		formData.append('metadata', JSON.stringify(bookData.metadata));
		formData.append('cover', bookData.cover, "cover_"+bookData.metadata.title);

		try {
			const response = await(await fetch(`${apiURL}/books`, {
				method: 'POST',
				body: formData
			})).json();
			if (response.success===true) {
				dispatch({ type: "uploadBookStatus", status: "uploaded" });
				dispatch({ type: "SET_BOOKSHELF_STATUS", status: "unloaded" });
				dispatch({ type: "alertModalUpdate", title: "Succes!", text: "Het uploaden is geslaagd!" })
			}else {
				dispatch({ type: "uploadBookStatus", status: "failed" });
				dispatch({ type: "alertModalUpdate", title: "Mislukt!", text: "Er is iets misgegaan bij het uploaden" })
			}
			
			
		} catch(err) {
			console.log(err);
			dispatch({ type: "uploadBookStatus", status: "failed" });
			dispatch({ type: "alertModalUpdate", title: "Mislukt!", text: "Er is iets misgegaan bij het uploaden" })
		}
		dispatch(dialogShow(true))

    }
}

export function uploadBookFileAction(file) {
    return { type: "uploadBookFileAction", file: file };
}

export function dialogShow(show) {
	return { type: "alertModalShow", show: show }
}