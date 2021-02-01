import Speech from 'speak-tts';
import { theStore } from "../index";
import { setSpeakerActive } from '../Actions/bookActions';
import LanguageDetect from 'languagedetect';

/**
 * This function detects the language of the text that needs to be spoken. And it initializes the speech object. 
 * @param {*} speech an empty string or the speech object from speak-tts
 * @param {*} text the text that needs to be spoken
 * @param {*} textToSpeech the text to speech object from the state with the rate
 */
function setTextToSpeech(speech, text, textToSpeech) {
    const lngDetector = new LanguageDetect();
    let language = lngDetector.detect(text, 1)[0][0]

    // Based on language, get the voice and lang
    let setting = setVoiceAndLanguage(language)

    // Set the volume, language, speed, voice
    speech.init({
        'volume': 1.0,
        'lang': setting.lang,
        'rate': textToSpeech.ttsRate,
        'pitch': 1,
        'voice': setting.voice,
        'splitSentences': true
    })
}
/**
 * This function creates the speech object and gets the selected text, with its alinea
 * @param {*} book the rendered book
 * @param {*} rendition the rendition object of the book
 * @param {*} dispatch dispatch from the state
 * @param {*} textToSpeech the text to speech object from the state
 */
export function getTheSelection(book, rendition, dispatch, textToSpeech) {
    const speech = new Speech();
    if (!speech.hasBrowserSupport()) { // returns a boolean
        alert('Uw browser ondersteunt geen text to speech!')
    }

    // Select text to make it speak
    rendition.on('selected', function (cfiRange, contents) {
        if (theStore.getState().book.textToSpeech.tts !== true) {
            dispatch(setSpeakerActive(true))
            // Split the cfiRange, and get the index of the first character that is selected and the index of the last character
            let endCharacter = parseInt(cfiRange.split(':')[2].split(')')[0])
            let startCharacter = (cfiRange.split(':')[1].split(',')[0])

            // Based on the cfiRange, create a cfiRange that adds one character before the selection and one after the selection
            // This is necessary, if 'a' is selected it splits on parts of words --> ' a ' doesnt
            let cfiRangeWithSpaces = cfiRange.split(':')[0] + ':' + (startCharacter - 1) + ',' + cfiRange.split(':')[1].split(',')[1] + ':' + (endCharacter + 1) + ')'

            // Based on the cfiRange, create a cfiRange that is the selected words + 8 extra characters
            let biggerCFI = cfiRange.split(':')[0] + ':' + (endCharacter + 1) + ',' + cfiRange.split(':')[1].split(',')[1] + ':' + (endCharacter + 8) + ')' //crate the cfi that  is bigger

            let spokenText = ''

            // Get the words from the book
            book.getRange(biggerCFI).then(function (range) {
                // Get the selected word + 6 extra characters
                let biggerRange = range.toString()
                book.getRange(cfiRangeWithSpaces).then(function (range) {
                    // The selected text
                    let selectedText = range.toString()
                    // Get the whole alinea, split it on the selected text
                    let splittedAlinea = range.startContainer.data.split(selectedText)
                    splittedAlinea.forEach((arr) => {
                        // if the part of the alinea includes the selected word + 8 extra characters
                        if (arr.includes(biggerRange) && biggerRange.length > 0 && arr.startsWith(biggerRange)) {
                            spokenText = spokenText + selectedText + arr.toString()
                        } else if (spokenText !== '') {
                            // if the word is already found, add the rest of the alinea that needs to be spoken
                            spokenText = spokenText + selectedText + arr.toString()
                        }
                    })
                    if (spokenText === '') {
                        spokenText = selectedText
                    }
                    //set the language
                    setTextToSpeech(speech, spokenText, textToSpeech)
                    //speak the selected words + the rest of the alinea
                    dispatch({ type: 'SET_SPEAK_TEXT', text: spokenText, cfiRange: cfiRange, speech: speech })
                }).catch(err => {
                    // Happens when the selected word is the first word of the section
                    book.getRange(cfiRange).then(function (range) {
                        let selectedText = range.toString()
                        let splittedAlinea = range.startContainer.data.split(selectedText)
                        splittedAlinea.forEach((arr) => {
                            if (arr.includes(biggerRange)) {
                                spokenText = spokenText + selectedText + arr.toString()
                            } else if (spokenText !== '') {
                                spokenText = spokenText + selectedText + arr.toString()
                            }
                        })
                        //set the language
                        setTextToSpeech(speech, spokenText, textToSpeech)
                        dispatch({ type: 'SET_SPEAK_TEXT', text: spokenText, cfiRange: cfiRange, speech: speech })
                    })
                })
            }).catch((err) => {
                // happens when the last word of an alinea is selected
                book.getRange(cfiRangeWithSpaces).then(async function (range) {
                    let selectedText = range.toString()
                    if (selectedText === '') {
                        book.getRange(cfiRange).then(function (range) {
                            //set the language
                            setTextToSpeech(speech, range.toString(), textToSpeech)
                            dispatch({ type: 'SET_SPEAK_TEXT', text: range.toString(), cfiRange: cfiRange, speech: speech })
                        })
                    } else {
                        //set the language
                        setTextToSpeech(speech, selectedText, textToSpeech)
                        dispatch({ type: 'SET_SPEAK_TEXT', text: selectedText, cfiRange: cfiRange, speech: speech })
                    }
                }).catch(err => {
                    book.getRange(cfiRange).then(function (range) {
                        //set the language
                        setTextToSpeech(speech, range.startContainer.data + range.endContainer.data, textToSpeech)
                        dispatch({ type: 'SET_SPEAK_TEXT', text: range.startContainer.data + range.endContainer.data, cfiRange: cfiRange, speech: speech })
                    })
                })
            })

        }
    })
    return speech
}
/**
 * This function speaks the text, then the playNextRow function is called
 * @param {*} speech speech object from speak-tts
 * @param {*} book rendered book 
 * @param {*} cfiRange the cfiRange of the text 
 * @param {*} spokenText the text that needs to be spoken
 * @param {*} dispatch the dispatch from the state
 * @param {*} rangeOfNextPart the object that is the next sibling
 */
export function letItSpeak(speech, book, cfiRange, spokenText, dispatch, rangeOfNextPart) {
    // if the text matches only special characters, do not say it, just go for the next one
    if (spokenText.match(/[\w]/g) !== null) {
        speech.speak({
            text: String(spokenText),
            queue: false,
            listeners: {
                onstart: () => {
                },
                onend: () => {
                },
                onresume: () => {
                },
                onboundary: (event) => {
                }
            }
        }).then(() => {
            playNextRow(book, cfiRange, speech, dispatch, rangeOfNextPart)
        })
    } else {
        playNextRow(book, cfiRange, speech, dispatch, rangeOfNextPart)
    }
}
/**
 * This function plays the next row, this is done by playing the next sibling.
 * This solves the problem that bold and italic words are not spoken.
 * @param {*} book the rendered book
 * @param {*} cfiRange the cfiRange of the text that needs to be spoken
 * @param {*} speech object of speak-tts
 * @param {*} dispatch the dispatch object from the state
 * @param {*} rangeOfNextPart the next row/alinea sibling object
 */
function playNextRow(book, cfiRange, speech, dispatch, rangeOfNextPart) {
    // if the first alinea is done, check if it is not speaking, 
    if (!speech.speaking()) {
        if (theStore.getState().book.textToSpeech.tts) {
            book.getRange(cfiRange).then(function (range) {
                if (range.startContainer.nextSibling === null) {
                    speakNewAlinea(book, speech, dispatch, cfiRange)
                } else if (rangeOfNextPart === '' || rangeOfNextPart === undefined) {
                    letItSpeak(speech, book, cfiRange, range.startContainer.nextSibling.textContent, dispatch, range.startContainer.nextSibling)
                    rangeOfNextPart = range.startContainer.nextSibling
                } else if (rangeOfNextPart.nextSibling === null) {
                    speakNewAlinea(book, speech, dispatch, cfiRange)
                } else {
                    letItSpeak(speech, book, cfiRange, rangeOfNextPart.nextSibling.textContent, dispatch, rangeOfNextPart.nextSibling)
                    rangeOfNextPart = rangeOfNextPart.nextSibling
                }
            }).catch(err => {
                dispatch(setSpeakerActive(false))
                stopSpeech(speech)
            })
        }
    }
}
/**
 * This function searches for the new alinea, if there isnt one, it stops.
 * It also searches for the new chapter.
 * @param {*} book the rendered book
 * @param {*} speech the object from speak-tts
 * @param {*} dispatch the dispatch object from the state
 * @param {*} cfiRange the cfiRange from the spoken text
 */
function speakNewAlinea(book, speech, dispatch, cfiRange) {
    let commaCFI = cfiRange.split(',')[0]
    // get the rownumber of the selected text
    let rowNumber = parseInt(commaCFI.split('/')[commaCFI.split('/').length - 1])
    // create the cfiRange that is the first word of the next sentence
    let nextRowCFI = cfiRange.split('/').slice(0, -3).join('/') + '/' + (rowNumber + 2) + ',/1:0,/1:5)'
    // speak the next alinea, set the next alinea in the queue
    book.getRange(nextRowCFI).then(function (range) {
        if (range.startContainer.data === undefined) {
            let commaCFI = cfiRange.split(',')[0]
            let nextRowCFI = commaCFI.split('/').slice(0, -1)[0] + '/' + commaCFI.split('/').slice(0, -1)[1] + '/' + commaCFI.split('/').slice(0, -1)[2] + '/' + commaCFI.split('/').slice(0, -1)[3] + '/' + commaCFI.split('/').slice(0, -1)[4] + ',/1:0,/1:5)'
            book.getRange(nextRowCFI).then(function (range) {
                cfiRange = nextRowCFI;
                letItSpeak(speech, book, cfiRange, range.startContainer.data, dispatch)
            }).catch(err => {
                dispatch(setSpeakerActive(false))
                stopSpeech(speech)
            })
        } else {
            cfiRange = nextRowCFI;
            letItSpeak(speech, book, cfiRange, range.startContainer.data, dispatch)
        }
    }).catch(err => {
        let commaCFI = cfiRange.split(',')[0]
        let nextRowCFI = commaCFI.split('/').slice(0, -1)[0] + '/' + commaCFI.split('/').slice(0, -1)[1] + '/' + commaCFI.split('/').slice(0, -1)[2] + '/' + commaCFI.split('/').slice(0, -1)[3] + '/' + commaCFI.split('/').slice(0, -1)[4] + ',/1:0,/1:5)'
        book.getRange(nextRowCFI).then(function (range) {
            if (range.startContainer.data.length <= 1) {
                // if the title is spoken, is the next row a /n or not?
                let nextRowCFI = commaCFI.split('/').slice(0, -1)[0] + '/' + commaCFI.split('/').slice(0, -1)[1] + '/' + commaCFI.split('/').slice(0, -1)[2] + '/' + commaCFI.split('/').slice(0, -1)[3] + '/' + (parseInt(commaCFI.split('/').slice(0, -1)[4]) + 2) + ',/3:4,/3:13)'
                book.getRange(nextRowCFI).then(function (range) {
                    cfiRange = nextRowCFI;
                    letItSpeak(speech, book, cfiRange, range.startContainer.data, dispatch)
                }).catch(err => {
                    let nextRowCFI = cfiRange.split('!')[0] + '!/' + cfiRange.split('!')[1].split('/')[1] + '/' + (parseInt(cfiRange.split('!')[1].split('/')[2]) + 4) + ',/1:0,/1:5)'
                    book.getRange(nextRowCFI).then(function (range) {
                        cfiRange = nextRowCFI;
                        letItSpeak(speech, book, cfiRange, range.startContainer.data, dispatch)
                    }).catch(err => {
                        dispatch(setSpeakerActive(false))
                        stopSpeech(speech)
                    })
                })
                letItSpeak(speech, book, cfiRange, range.startContainer.data, dispatch)
            } else {
                cfiRange = nextRowCFI;
                letItSpeak(speech, book, cfiRange, range.startContainer.data, dispatch)
            }
        }).catch(err => {
            let commaCFI = cfiRange.split(',')[0]
            let rowNumber = parseInt(commaCFI.split('/')[commaCFI.split('/').length - 1])
            let nextRowCFI = cfiRange.split('/').slice(0, -3).join('/') + '/' + (rowNumber + 6) + '/2,/1:0,/1:5)'
            book.getRange(nextRowCFI).then(function (range) {
                cfiRange = nextRowCFI;
                letItSpeak(speech, book, cfiRange, range.startContainer.data, dispatch)
            }).catch(err => {
                let chapterIndex;
                book.spine.spineItems.forEach(chapter => {
                    if (cfiRange.split('[')[1].split(']')[0] === chapter.idref) {
                        chapterIndex = chapter.index
                    }
                })
                let nextAlinea = cfiRange.split('[')[0]
                let nextRowCFI = nextAlinea.split('/')[0] + book.spine.spineItems[chapterIndex + 1].cfiBase + '!/4/2/2,/1:0,/1:7)'
                book.getRange(nextRowCFI).then(function (range) {
                    cfiRange = nextRowCFI;
                    letItSpeak(speech, book, cfiRange, range.startContainer.data, dispatch)
                }).catch(err => {
                    let nextRowCFI = nextAlinea.split('/')[0] + book.spine.spineItems[chapterIndex + 1].cfiBase + '!/4/4,/1:0,/1:7)'
                    book.getRange(nextRowCFI).then(function (range) {
                        cfiRange = nextRowCFI;
                        letItSpeak(speech, book, cfiRange, range.startContainer.data, dispatch)
                    }).catch(err => {
                        //something went wrong with the chapter
                        dispatch(setSpeakerActive(false))
                        stopSpeech(speech)
                    })
                })
            })
        })
    })
}
/**
 * This function stops the text to speech
 * @param {*} speech object from speak-tts
 */
export function stopSpeech(speech) {
    speech.cancel()
}
/**
 * Based on the language, set the language and the voice the text to speech library needs.
 * @param {*} language the language that is detected
 */
export function setVoiceAndLanguage(language) {
    //japanese, korean, 3 versions of chinese are not supported
    let languages = [
        {
            language: 'dutch',
            lang: 'nl-NL',
            voice: 'Google Nederlands',
        }, {
            language: 'german',
            lang: 'de-DE',
            voice: 'Google Deutsch',
        }, {
            language: 'english',
            lang: 'en-US',
            voice: 'Google US English',
        }, {
            language: 'spanish',
            lang: 'es-ES',
            voice: 'Google español',
        }, {
            language: 'french',
            lang: 'fr-FR',
            voice: 'Google français',
        }, {
            language: 'italian',
            lang: 'it-IT',
            voice: 'Google italiano',
        }, {
            language: 'polish',
            lang: 'pl-PL',
            voice: 'Google polski',
        }, {
            language: 'hindi',
            lang: 'hi-IN',
            voice: 'Google हिन्दी',
        }, {
            language: 'indonesian',
            lang: 'id-ID',
            voice: 'Google Bahasa Indonesia',
        }, {
            language: 'portuguese',
            lang: 'pt-BR',
            voice: 'Google português do Brasil',
        }, {
            language: 'russian',
            lang: 'ru-RU',
            voice: 'Google русский',
        }]

    let setting = {}
    languages.forEach((possibleLanguage) => {
        if (possibleLanguage.language === language) {
            setting = { ...setting, ...possibleLanguage }
        }
    })
    return setting
}

export function speakIntroduction(text) {
    const speech = new Speech()

    if (!speech.hasBrowserSupport()) {
        alert("Text to speech wordt niet ondersteund in uw browser!")
    }
    speech.init({
        'volume': 1,
        'rate': 0.8,
        'pitch': 1,
        'voice': 'Google Nederlands'
    }).then(() => {
        speech.speak({
            text: text
        })
    })
    return speech
}