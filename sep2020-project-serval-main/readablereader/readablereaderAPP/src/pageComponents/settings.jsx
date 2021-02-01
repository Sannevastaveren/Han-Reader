import { Page, Navbar } from "framework7-react";
import { setReadingMethod, setSpeechSpeed, loadPreferences } from '../Actions/bookActions'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { TabbarBottom, TabbarPopup } from "../components/components";
import { speakIntroduction } from "../components/textToSpeech"

export default function Settings(props) {
    const dispatch = useDispatch();
    const readingMethod = useSelector((state) => state.book.readingMethod);
    const textToSpeech = useSelector((state) => state.book.textToSpeech);
    const status_pref = useSelector((state) => state.book.preferencesStatus);

    useEffect(() => {
        if (status_pref === 'unloaded') {
            dispatch(loadPreferences())
        }
    }, [status_pref])
    const showMenu = useSelector(state => state.component.showMenu);

    function getReadingMethod(e) {
        if (e.target.value === 'Bladeren') {
            dispatch(setReadingMethod('paginated'))
        } else if (e.target.value === 'Scrollen') {
            dispatch(setReadingMethod('scrolled'))
        }
    }
    let methodContent = ''
    if (readingMethod === 'scrolled') {
        methodContent = 'Scrollen'
    } else if (readingMethod === 'paginated') {
        methodContent = 'Bladeren'
    }

    let speech;
    const navBar = showMenu ? <Navbar title="Settings" hidden></Navbar> : (<Navbar title="Settings"><a href="#" id='backButton' className="home-back" slot="nav-left" onClick={() => props.$f7router.back()}>Back</a></Navbar>);

    return (
        <Page name='settings'>
            {navBar}
            <div id={'topbar-tts-left-bottom'} className={'topbar-tts-left-bottom'}
                onClick={() => {
                    if (speech === undefined || !speech.speaking()) {
                        speech = speakIntroduction('Om de manier van lezen aan te passen, klik op "Manier van lezen" en pas de instelling aan naar bladeren of scrollen.')
                        speech = speakIntroduction('Om de snelheid van de tekst to speech aan te passen, klik op "Tekst to speech snelheid", 0.5 is langzaam en 2.0 is heel snel.')
                    } else if (speech.speaking()) {
                        speech.cancel()
                    }
                }}>
                <i key={'speaker_2_fill'} id={'speaker_2_fill'} className="f7-icons">
                    {'speaker_2_fill'}
                </i>
            </div>
            <div className="list" style={{ margin: "5rem 0" }}>
                <ul>
                    <li>
                        <a href="#" className="item-link smart-select">
                            <select name="reading-method" onChange={getReadingMethod} defaultValue={methodContent}>
                                <option value="Bladeren">Bladeren</option>
                                <option value="Scrollen">Scrollen</option>
                            </select>
                            <div className="item-content">
                                <div className="item-inner" id='content'>
                                    <div className="item-title" id='readingMethod'>Manier van lezen</div>
                                    <div className="item-after">{methodContent}</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="item-link smart-select">
                            <select name="text-to-speech-speed" onChange={(e) => dispatch(setSpeechSpeed(e.target.value))} defaultValue={textToSpeech.ttsRate}>
                                <option value="0.5">0.5</option>
                                <option value="0.6">0.6</option>
                                <option value="0.7">0.7</option>
                                <option value="0.8">0.8</option>
                                <option value="0.9">0.9</option>
                                <option value="1.0">1.0</option>
                                <option value="2.0">2.0</option>
                            </select>
                            <div className="item-content">
                                <div className="item-inner">
                                    <div className="item-title">Tekst to speech snelheid</div>
                                    <div className="item-after">{textToSpeech.ttsRate}</div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <TabbarPopup />
            <TabbarBottom />
        </Page>
    )
}
