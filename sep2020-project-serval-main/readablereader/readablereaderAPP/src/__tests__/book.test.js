import BookReducer from "../Reducers/BookReducer";

describe("BookReducer", () => {
    it("Can show the preference dialog", () => {
        const state = {
            showPreferences: false,
        }
        let boolean = true
        const output = BookReducer(state, { type: 'SHOW_PREFDIALOG', boolean });
        expect(output.showPreferences).toEqual(true)
    });
    it("Should change preferences", () => {
        const state = {
            book: {
                preferences:{
                    fontSize: 20,
                    fontFamily: 'opendyslexic',
                    fontColor: 'black',
                    backgroundColor: 'white',
                    lineHeight: 2,
                    letterSpacing: 2
                }
            }
        }
        let preferences = {
            fontSize: 25,
            fontFamily: 'Arial',
            fontColor: 'red',
            backgroundColor: 'black',
            lineHeight: 5,
            letterSpacing: 5
        }
        const output = BookReducer(state, { type: 'PREFERENCES_CHANGED', preferences});
        expect(output.preferences.fontSize).toEqual(25);
        expect(output.preferences.fontFamily).toEqual('Arial');
        expect(output.preferences.fontColor).toEqual('red');
        expect(output.preferences.backgroundColor).toEqual('black');
        expect(output.preferences.lineHeight).toEqual(5);
        expect(output.preferences.letterSpacing).toEqual(5);
    });
    it("Should not change fontSize if fontSize is lower than 12", () => {
        const state = {
            book: {
                preferences:{
                    fontSize: 20,
                    fontFamily: 'opendyslexic',
                    fontColor: 'black',
                    backgroundColor: 'white',
                    lineHeight: 2,
                    letterSpacing: 2
                }
            }
        }
        let preferences = {
            fontSize: 11,
            fontFamily: 'Arial',
            fontColor: 'red',
            backgroundColor: 'black',
            lineHeight: 5,
            letterSpacing: 5
        }
        const output = BookReducer(state, { type: 'PREFERENCES_CHANGED', preferences});
        expect(output.preferences.fontSize).toEqual(12);
    });
    it("Should not change lineHeight if lineHeight is smaller than 1", () => {
        const state = {
            book: {
                preferences:{
                    fontSize: 20,
                    fontFamily: 'opendyslexic',
                    fontColor: 'black',
                    backgroundColor: 'white',
                    lineHeight: 2,
                    letterSpacing: 2
                }
            }
        }
        let preferences = {
            fontSize: 25,
            fontFamily: 'Arial',
            fontColor: 'red',
            backgroundColor: 'black',
            lineHeight: 0,
            letterSpacing: 5
        }
        const output = BookReducer(state, { type: 'PREFERENCES_CHANGED', preferences});
        expect(output.preferences.lineHeight).toEqual(1);
    });
    it("Should not change lineHeight if lineHeight is bigger than 14", () => {
        const state = {
            book: {
                preferences:{
                    fontSize: 20,
                    fontFamily: 'opendyslexic',
                    fontColor: 'black',
                    backgroundColor: 'white',
                    lineHeight: 2,
                    letterSpacing: 2
                }
            }
        }
        let preferences = {
            fontSize: 25,
            fontFamily: 'Arial',
            fontColor: 'red',
            backgroundColor: 'black',
            lineHeight: 15,
            letterSpacing: 5
        }
        const output = BookReducer(state, { type: 'PREFERENCES_CHANGED', preferences});
        expect(output.preferences.lineHeight).toEqual(14);
    });
    it("Should not change letterSpacing if letterSpacing is smaller than -1", () => {
        const state = {
            book: {
                preferences:{
                    fontSize: 20,
                    fontFamily: 'opendyslexic',
                    fontColor: 'black',
                    backgroundColor: 'white',
                    lineHeight: 2,
                    letterSpacing: 2
                }
            }
        }
        let preferences = {
            fontSize: 25,
            fontFamily: 'Arial',
            fontColor: 'red',
            backgroundColor: 'black',
            lineHeight: 0,
            letterSpacing: -2
        }
        const output = BookReducer(state, { type: 'PREFERENCES_CHANGED', preferences});
        expect(output.preferences.letterSpacing).toEqual(-1);
    });
    it("Should not change letterSpacing if letterSpacing is bigger than 14", () => {
        const state = {
            book: {
                preferences:{
                    fontSize: 20,
                    fontFamily: 'opendyslexic',
                    fontColor: 'black',
                    backgroundColor: 'white',
                    lineHeight: 2,
                    letterSpacing: 2
                }
            }
        }
        let preferences = {
            fontSize: 25,
            fontFamily: 'Arial',
            fontColor: 'red',
            backgroundColor: 'black',
            lineHeight: 15,
            letterSpacing: 15
        }
        const output = BookReducer(state, { type: 'PREFERENCES_CHANGED', preferences});
        expect(output.preferences.letterSpacing).toEqual(14);
    });
    it("Should change the reading method", () => {
        const state = {
            book: {
                readingMethod: 'paginated'
            }
        }
        let method = 'scrolled-doc';
        const output = BookReducer(state, { type: 'SET_READINGMETHOD', method})
        expect(output.readingMethod).toEqual('scrolled-doc')
    })
    it("Should change the speech speed", () => {
        const state = {
            book: {
                textToSpeech:{
                    ttsRate: 0.8
                }
            }
        }
        let speed = 2.0
        const output = BookReducer(state, {type: 'SET_SPEECH_SPEED', speed})
        expect(output.textToSpeech.ttsRate).toEqual(2.0)
    })
    it("should update the lastLocation variable with the epubcfi of the last page you were on", () => {
        const state = {
            book: {
                lastLocation: 'epubcfi(test)',
                ready: false
            }
        }
        const location = {
                    chapterNumber: 1,
                    currentPage: 1,
                    totalPages: 24,
                    epubcfi: 'epubcfi(test)',
        }

        const output = BookReducer(state, { type: 'LAST_LOCATION', location});
        expect(output.lastLocation).toEqual('epubcfi(test)');
        expect(output.ready).toEqual(true);
    });
    it("should update the currentLocation variable with the right numbers and epubcfi that you're currently on", () => {
        const state = {
            book: {
                currentLocation:{
                    chapterNumber: 0,
                    currentPage: 0,
                    totalPages: 0,
                    epubcfi: 'epubcfi(last)'
                },
            }
        }
        const location = {
            chapterNumber: 1,
            currentPage: 1,
            totalPages: 24,
            epubcfi: 'epubcfi(new)',
        }

        const output = BookReducer(state, { type: 'NEW_LOCATION', location});
        expect(output.currentChapter).toEqual(location);
    });
    it("Should set text-to-speech as active/not-active", () => {
        const state = {
            book: {
                textToSpeech:{
                    tts: false
                }
            }
        }
        let boolean = true
        let output = BookReducer(state, {type: 'SET_SPEAKER_ACTIVE', boolean})
        expect(output.textToSpeech.tts).toEqual(true)

        boolean = false
        output = BookReducer(state, {type: 'SET_SPEAKER_ACTIVE', boolean})
        expect(output.textToSpeech.tts).toEqual(false)
    });
    it("Should change the text to speech language", () => {
        const state = {
            book: {
                language: ''
            }
        }
        let language = 'dutch'
        let output = BookReducer(state, {type: 'SET_LANGUAGE', language})
        expect(output.language).toEqual('dutch')
    });
    it("Should change the text to speech text", () => {
        const state = {
            book: {
                textToSpeech:{
                    text: {}
                }
            }
        }
        let selectedText = 'This text is selected'
        let cfiRange = 'SomeCFIRange'
        let output = BookReducer(state, {type: 'SET_SPEAK_TEXT', text: selectedText, cfiRange: cfiRange})
        expect(output.textToSpeech.text).toEqual({text: 'This text is selected', cfiRange: 'SomeCFIRange'})
    })
    it("Should change the text to speech speech", () => {
        const state = {
            book: {
                textToSpeech:{
                    speech: {}
                }
            }
        }
        let speech = {language: 'Some language', settings: 'Some value'}
        let output = BookReducer(state, {type: 'SET_SPEECH', speech: speech})
        expect(output.textToSpeech.speech).toEqual({language: 'Some language', settings: 'Some value'})
    })
});
