const initialBookState = {
    rendition: {},
    book: {},
    lastLocation: undefined,
    currentChapter : {
        currentPage: 0,
        chapterNumber: 0,
        totalPages: 0,
        epubcfi: undefined,
    },
    preferences: {
        fontSize: 40,
        fontFamily: 'Arial',
        fontColor: 'black',
        backgroundColor: 'white',
        lineHeight: 2,
        letterSpacing: 2
    },
    ready : false,
    confirmedPreferences: {
        fontSize: 40,
        fontFamily: 'Arial',
        fontColor: 'black',
        backgroundColor: 'white',
        lineHeight: 2,
        letterSpacing: 2
    },
    showPreferences: false,
    bookID: undefined,
    readingMethod: "scrolled",
    textToSpeech: {
        tts: false, //if text is clicked, should textToSpeech be active? 
        ttsRate: 0.8,
        text: {},
        speech: {}
    },
    language: '',
	preferencesStatus: "unloaded",
	languageLoaded: "unloaded"
}

const BookReducer = (state = initialBookState, action) => {
    switch (action.type) {
        case 'RENDITION_COMPLETE': {
            return { ...state, rendition: action.rendition, book: action.book, ready: false}
        }
        case 'LAST_LOCATION': {
            return {...state, lastLocation: action.location.epubcfi, ready: true}
        }
        case 'NEW_LOCATION': {
            return {...state, currentChapter: action.location}
		}
		case 'PREFERENCES_STATUS': {
			return {...state, preferencesStatus: action.status};
		}
		case 'PREFERENCES_LOADED': {
			return {...state,
                confirmedPreferences: {...action.loadedData.preferences},
                preferences: {...action.loadedData.preferences},
                textToSpeech: {...action.loadedData.textToSpeech},
                readingMethod: action.loadedData.readingMethod
		    };
		}
        case 'PREFERENCES_CHANGED':
            const temp = {...state.preferences};
            temp.fontFamily = action.preferences.fontFamily;
            temp.fontColor = action.preferences.fontColor;
            if(action.preferences.fontSize > 12){
                temp.fontSize = action.preferences.fontSize;
            }else{
                temp.fontSize = 12
            }
            temp.backgroundColor = action.preferences.backgroundColor;
            if(action.preferences.lineHeight < 15 && action.preferences.lineHeight >1){
                temp.lineHeight = action.preferences.lineHeight;
            }else if(action.preferences.lineHeight >= 15){
                temp.lineHeight = 14
            }else if(action.preferences.lineHeight <=1){
                temp.lineHeight = 1
            }
            if(action.preferences.letterSpacing < 15 && action.preferences.letterSpacing >-1){
                temp.letterSpacing = action.preferences.letterSpacing;
            }else if(action.preferences.letterSpacing >= 15){
                temp.letterSpacing = 14
            }else if(action.preferences.letterSpacing <=-1){
                temp.letterSpacing = -1
            }
            return { ...state, preferences: temp}
        case 'CONFIRM_PREFERENCES':
            const confirmedPref = {...state.confirmedPreferences};
            confirmedPref.fontFamily = action.preferences.fontFamily;
            confirmedPref.fontColor = action.preferences.fontColor;
            confirmedPref.fontSize = action.preferences.fontSize;
            confirmedPref.backgroundColor = action.preferences.backgroundColor;
            confirmedPref.lineHeight = action.preferences.lineHeight;
            confirmedPref.letterSpacing = action.preferences.letterSpacing;
            return { ...state, confirmedPreferences: confirmedPref}
        case 'SHOW_PREFDIALOG':
            return {...state, showPreferences: action.boolean}
        case 'SET_READINGMETHOD':
            return {...state, readingMethod: action.method}
        case 'SET_SPEECH_SPEED':
            const textToSpeechRate = {...state.textToSpeech}
            textToSpeechRate.ttsRate = action.speed
            return {...state, textToSpeech: textToSpeechRate}
        case 'SET_SPEAKER_ACTIVE':
            const textToSpeechActive = {...state.textToSpeech}
            textToSpeechActive.tts = action.boolean
            return {...state, textToSpeech: textToSpeechActive}
        case 'SET_LANGUAGE':
            return {...state, language: action.language}
        case 'SET_SPEAK_TEXT':
            const textToSpeechText = {...state.textToSpeech}
                textToSpeechText.text = {text: action.text, cfiRange: action.cfiRange}
                textToSpeechText.speech = action.speech
            return { ...state, textToSpeech: textToSpeechText }
        case 'SET_SPEECH':
            const textToSpeechSpeech = {...state.textToSpeech}
            textToSpeechSpeech.speech = action.speech
			return {...state, textToSpeech: textToSpeechSpeech}
        default: {
            return state
        }
    }
}

export default BookReducer
