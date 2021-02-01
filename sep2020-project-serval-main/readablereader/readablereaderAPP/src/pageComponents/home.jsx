import React from "react";
import previewImage from '../components/preview.png';
import { speakIntroduction } from '../components/textToSpeech'

import { Page, Block, BlockTitle, Button, Link } from 'framework7-react';

export const Home = props => {
	let speech;

	return (
		<Page name="home">
			<div id={'topbar-tts'} className={'topbar-tts'}
				onClick={() => {
					if (speech === undefined || !speech.speaking()) {
						speech = speakIntroduction('Als je nog geen account hebt, klik op de grote blauwe balk "Account aanmaken".')
						speech = speakIntroduction('Als je al wel een account hebt, klik op "Log hier in".')
					} else if (speech.speaking()) {
						speech.cancel()
					}
				}}>
				<i key={'speaker_2_fill'} id={'speaker_2_fill'} className="f7-icons">
					{'speaker_2_fill'}
				</i>
			</div>

			<BlockTitle style={{ fontSize: '5rem', textAlign: "center", padding: '1.5rem 0', margin: "3rem auto", maxWidth: '90%' }}>Readable Reader</BlockTitle>

			<div className="homepage-image">
				<img src={previewImage} alt="logo" style={{ width: "80%", float: "none", margin: "0 10%" }} />
			</div>

			<Block style={{ width: "max-content", margin: "3rem auto" }}>
				<Button href="/create" fill large style={{ fontSize: '4.5rem', height: '6rem', padding: '1.5rem 1rem', fontWeight: "700" }}>Account aanmaken</Button>
			</Block>

			<BlockTitle className="loginfooter" style={{ margin: "0" }}>Heb je al een account?</BlockTitle>
			<BlockTitle className="loginfooter" style={{ margin: "0" }}><Link href="/login">Log hier in.</Link></BlockTitle>

		</Page>
	)
}