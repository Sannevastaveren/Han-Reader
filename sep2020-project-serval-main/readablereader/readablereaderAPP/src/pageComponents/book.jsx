import {Page} from "framework7-react";
import Epub from "epubjs";
import "../components/book.css";
import "framework7-icons/css/framework7-icons.css";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    saveRendition,
    showPreferencesDialog,
    getLastLocation,
    loadPreferences,
    setSpeakerActive
} from "../Actions/bookActions";
import {Navigation, PreferencesSwipe, TabbarBottom, TabbarPopup, TopbarButton} from '../components/components'
import {getTheSelection, stopSpeech, letItSpeak, speakIntroduction} from '../components/textToSpeech';
import {theStore} from "../index";
import {changePreferences} from "../components/preferences";

export default function Book(props) {
    const dispatch = useDispatch();
    const rendition = useSelector((state) => state.book.rendition);
    const book = useSelector((state) => state.book.book);
    const lastLocation = useSelector((state) => state.book.lastLocation)
    const showPreferences = useSelector((state) => state.book.showPreferences);
    const preferences = useSelector((state) => state.book.preferences);
    const confirmedPreferences = useSelector((state) => state.book.confirmedPreferences);
    const readingMethod = useSelector((state) => state.book.readingMethod);
    const textToSpeech = useSelector((state) => state.book.textToSpeech);
    let bookID = useSelector((state) => state.book.bookID);
    let ready = useSelector((state) => state.book.ready);
    let status_pref = useSelector(state => state.book.preferencesStatus)

    // Navigate to the login page if the user has not logged in yet.
    if (sessionStorage.username === undefined) props.f7router.navigate("/login")
    else checkBookPossession(sessionStorage.username)


    if (props.bookID !== undefined) {
        bookID = props.bookID;
        sessionStorage.bookID = bookID;
    }
    useEffect(() => {
        // if there is a bookID then make and render the book to the page
        if (bookID !== '') {
            // get the last location if there is a bookID in the header
            setTimeout(() => {
                dispatch(getLastLocation())
            }, 1000)
        }
    }, [])

    useEffect(() => {
        // if the preferences aren't loaded in
        if (status_pref === 'unloaded') {
            // load preferences
            dispatch(loadPreferences())
          // if the preferences are loaded and the book has been readied
        } else if (status_pref === 'loaded' && rendition.started) {
            // make changing preferences possible
            changePreferences(dispatch, rendition, preferences, confirmedPreferences)
        }
        // if the page has loaded the last last location
        if (ready) {
            // open the book
            openBook()
        }
        // if the last location is loaded and the book has been opened
        if (lastLocation && ready === false) {
            // load the last page of the book and render it
            async function loadLastPage() {
                for (let i = 0; i < 5; i++) {
                    await rendition.display(lastLocation)
                }
            }
            // call async function ^
            loadLastPage()
        }

    }, [lastLocation, ready, status_pref])


    /**
     CheckBookPossesion checks if the book belongs to the user trying to open the book and if it doesnt it will redirect to the login page
     */
    async function checkBookPossession(user) {
        const request = await fetch(`http://localhost:3001/api/v1/users/${sessionStorage.username}/books`, {
            method: 'GET',
            headers: []
        })
        const response = await request.text();
        const data = JSON.parse(response)
        const foundBook = (data.find(book => book._id === bookID));
        if (foundBook === undefined) {
            props.f7router.navigate("/login");
        }
    }

    /**
     openBook opens the epub file by its file name and calls the renderBook function
     */
    async function openBook(file) {
        if (book.ready) {
            book.destroy()
        }
        let book1 = {}
        if (file) {
            book1 = Epub(file)
            await renderBook(book1)
        } else {
            // this should be the id of the book that you click in the bookshelf (should be in session)
            book1 = Epub(`http://localhost:3001/api/v1/books/${sessionStorage.bookID}`, {openAs: 'epub'})
            if (book) {
                await renderBook(book1)
            } else {
                console.log('sorry no book')
            }
        }
    }

    /**
     * this updates the current location whenever you stop scrolling and sends it to the state as NEW_LOCATION
     */
    if (rendition.started) {
        rendition.on("relocated", function (location) {
            let currentLocation = {
                currentPage: location.start.displayed.page,
                chapterNumber: location.start.index,
                totalPages: location.start.displayed.total,
                epubcfi: location.start.cfi
            }
            if (currentLocation.epubcfi !== theStore.getState().book.currentChapter.epubcfi) {
                dispatch({type: 'NEW_LOCATION', location: currentLocation})
            }
        })
        rendition.on("rendered", function () {
            // call the text to speech function
            getTheSelection(book, rendition, dispatch, textToSpeech)

        })
    }

    /**
     renderBook takes the Book made from the Epub file and applies the correct modifications to the render
     then displays it in the Viewer component
     */
    async function renderBook(book1) {
        if (rendition.started) {
            rendition.destroy()
        }
        let renditions = book1.renderTo("viewer", {
            width: window.innerWidth,
            height: window.innerHeight,
            flow: readingMethod,
            manager: 'continuous',
            spread: "none",
        });
        let theme = {};
        let htmlComponents = ['head', 'div', 'body', 'p', 'span'];
        htmlComponents.forEach(comp => {
            theme[comp] = {
                "font-size": preferences.fontSize + "px !important",
                color: preferences.fontColor + ' !important',
                background: preferences.backgroundColor + ' !important',
                "font-family": preferences.fontFamily + ' !important',
                "line-height": preferences.lineHeight + ' !important',
                "letter-spacing": preferences.letterSpacing + "px !important"
            }
        });
        await renditions.themes.default(theme);
        await renditions.display()
        await dispatch(saveRendition(renditions, book1))
    }
    let speech;
	const topBarButtons = [
        {
            position: 'tts',
            onClick: () => {
                if(speech === undefined || !speech.speaking()){
                    speech = speakIntroduction('Klik op de rode knop rechts boven in de hoek om instellingen te veranderen en swipe om meer instellingen aan te passen.')
                    speech = speakIntroduction('Klik op de oranje knop links onder om terug te gaan naar waar je gebleven was toen je het boek opende.')
                    speech = speakIntroduction('Selecteer een woord (houd een woord lang ingedrukt) als je text to speech wilt gebruiken.')
                    speech = speakIntroduction('Klik op de blauwe knop in de rechterhoek om het menu te openen en bijvoorbeeld terug te gaan naar de boekenkast of om bij instellingen de snelheid van text to speech aan te passen.')
                } else if(speech.speaking()){
                    speech.cancel()
                }
            },
            childs: ['speaker_2_fill'],
            display: 'inline'
        },
        {
            position: "bottom-left",
            onClick: () => {
                rendition.display(lastLocation)
            },
            childs: ['gobackward'],
            display: 'inline'
        },
        {
            position: 'right',
            onClick: () => dispatch(showPreferencesDialog(true)),
            childs: ['menu'],
            display: 'inline'
        }
    ]

    const TopBarButtonsComponent = topBarButtons.map(btn => {
        return <TopbarButton key={btn.childs} position={btn.position} onClick={btn.onClick} childs={btn.childs}
                             iconColor={btn.iconColor}/>
    })

    return (
        <Page name="book">
            <div style={{
                display: "flex",
                zIndex: 999,
                justifyContent: "flex-end",
                background: 'var(--f7-page-bg-color)',
                top: 0,
                position: 'sticky',
                height: 'fit-content'
            }}>
                {TopBarButtonsComponent}
            </div>
            <div className='buttons_tts' style={{display: textToSpeech.tts ? 'flex' : 'none'}}>
                <div id={'playButton'} style={{backgroundColor: 'green'}}
                     onClick={() => {
                         letItSpeak(textToSpeech.speech, book, textToSpeech.text.cfiRange, textToSpeech.text.text, dispatch, '')
                     }}>
                    <i key={'play_fill'} id={'play_fill'} className="f7-icons">
                        {'play_fill'}
                    </i>
                </div>
                <div id={'stopButton'} style={{backgroundColor: 'red'}}
                     onClick={() => {
                         stopSpeech(textToSpeech.speech)
                         dispatch(setSpeakerActive(false))
                     }}>
                    <i key={'stop_fill'} id={'stop_fill'} className="f7-icons">
                        {'stop_fill'}
                    </i>
                </div>
            </div>

            <div style={{position: "relative"}}>
                {readingMethod === 'scrolled_doc'
                    ? <div id="viewer" className={"scrolled"}/>
                    : <div id="viewer" className={"spreads"}/>}
                {readingMethod === 'scrolled' ? null :
                    <Navigation/>}
            </div>

            {showPreferences ?
                <PreferencesSwipe show={showPreferences} dispatch={dispatch} rendition={rendition}
                                  preferences={preferences} confirmedPreferences={confirmedPreferences}/>
                : null}
            <TabbarPopup/>
            <TabbarBottom/>
        </Page>
    );
}
