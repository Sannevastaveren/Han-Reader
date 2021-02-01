import { apiURL } from '../index'

export function saveRendition(rendition, book){
    return (dispatch) => {
        dispatch({type: 'RENDITION_COMPLETE', rendition, book})
    }
}
export function savePreferences(preferences){
    return{type: 'PREFERENCES_CHANGED', preferences}
}
export function navigationAction(direction,number, chapter, epubcfi){

    return{type: `${direction}_PAGE`, payload: {number:  number, chapter: chapter, epubcfi: epubcfi}}

}
export function showPreferencesDialog(boolean){
    return{type: 'SHOW_PREFDIALOG', boolean}
}

export const getLastLocation = () => {
    return async (dispatch) => {
        try {
            const request = await fetch(`${apiURL}/users/${sessionStorage.username}/books/${sessionStorage.bookID}/currentLocation`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            await fetch(`${apiURL}/users/${sessionStorage.username}/books/${sessionStorage.bookID}/lastOpened`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const response = await request.json()
            await dispatch({type: 'LAST_LOCATION', location: response.currentLocation})

        } catch (err) {
            console.log(err)
        }
    }
}

export function confirmPreferences(preferences){
	return async (dispatch) => {
		dispatch({type: 'CONFIRM_PREFERENCES', preferences});

		await fetch(`${apiURL}/users/${sessionStorage.username}/preferences`, {
			method: 'PUT',
			body: JSON.stringify(preferences),
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})

	}
}

export function loadPreferences() {
	return async dispatch => {
		dispatch({type: 'PREFERENCES_STATUS', status: 'loading'});

		try {
			const loadedData = await (await fetch(`${apiURL}/users/${sessionStorage.username}/preferences`, {
				method: 'GET'
			})).json();
			dispatch({type: 'PREFERENCES_LOADED', loadedData});
			dispatch({type: 'PREFERENCES_STATUS', status: 'loaded'})
		} catch (err) {
			dispatch({type: 'PREFERENCES_STATUS', status: 'failed'})
		}

	}
}

export function setReadingMethod(method){
    return async (dispatch) => {
        dispatch({type: 'SET_READINGMETHOD', method});

        await fetch(`${apiURL}/users/${sessionStorage.username}/readingMethod`, {
            method: 'PUT',
            body: JSON.stringify({method: method}),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
    }

}
export function setSpeechSpeed(speed){
    return async (dispatch) => {
        dispatch({type: 'SET_SPEECH_SPEED', speed});

        await fetch(`${apiURL}/users/${sessionStorage.username}/tts`, {
            method: 'PUT',
            body: JSON.stringify({ttsRate: speed}),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
    }
}
export function setSpeakerActive(boolean){
    return {type: 'SET_SPEAKER_ACTIVE', boolean}
}
export function setLanguage(language){
    return{type: 'SET_LANGUAGE', language}
}
