import React from 'react';
import { BlockFooter, List, ListItem, Preloader, Link, SwipeoutActions, SwipeoutButton } from 'framework7-react';
import { changePreferences } from './preferences'

import { useDispatch, useSelector } from 'react-redux';

import './tabbar.css';
import './booklist.css';
import { showPreferencesDialog, confirmPreferences } from '../Actions/bookActions';
import { Swiper, SwiperSlide } from 'swiper/react';
import { speakIntroduction } from './textToSpeech';

const fetch = require('node-fetch');

const deleteBook = async (bookId) => {
	try {
		return await fetch(`http://localhost:3001/api/v1/books/${bookId}`, {
			method: 'delete'
		});
	} catch (err) {
		return err;
	}
}

export function BookList(props) {
	let bookList;

	if (props.books.length > 0) {
		bookList = props.books.map((book) => {
			return (
				<ListItem
					swipeout
					onSwipeoutDeleted={() => deleteBook(book._id)}
					id='bookLink' key={book._id} link={"/book/" + book._id} title={book.metadata.title} subtitle={book.metadata.creator}>
					<SwipeoutActions right>
						<SwipeoutButton delete confirmTitle="Boek verwijderen" confirmText="Weet je zeker dat je dit boek wilt verwijderen?">
							<i className="f7-icons" style={{ fontSize: "7rem" }}>trash</i></SwipeoutButton>
					</SwipeoutActions>
					<SwipeoutActions left>
						<SwipeoutButton color='pink' onClick={() => speakIntroduction('De titel van het boek is: ' + book.metadata.title + ' en de auteur is: ' + book.metadata.creator)}>
							<i className="f7-icons" style={{ fontSize: "7rem" }}>speaker_2_fill</i></SwipeoutButton>
					</SwipeoutActions>
					<img slot="media" src={book.coverImage} alt="" />
				</ListItem>
			)

		});
	} else if (!props.loading) {
		bookList = <BlockFooter style={{ textAlign: "center", margin: "8rem auto" }}>Je hebt nog geen boeken geupload.</BlockFooter>
	}

	return (
		<List mediaList style={{ margin: "3rem 0" }}>
			{bookList}
		</List>
	);
}

export function PreferencesSwipe(props) {
	let fontSizeButtons = '200px';
	let widthButtons = '220px';
	let heightButtons = '200px';

	// Set the color buttons
	let backgroundColors = ['white', 'black', 'lemonchiffon', '#5A3B5D']
	let fontColors = ['black', 'white', 'black', '#FFD600']
	let themes = backgroundColors.map((backgroundColor, index) =>
		<button key={backgroundColor} className="button button-raised button-large button-fill"
			style={{ height: heightButtons, width: widthButtons, margin: '10px', backgroundColor: backgroundColor }}
			onClick={() => {
				props.preferences.fontColor = fontColors[index]
				props.preferences.backgroundColor = backgroundColor
				changePreferences(props.dispatch, props.rendition, props.preferences)
			}}>
			<i className="f7-icons"
				style={{ fontSize: fontSizeButtons, color: fontColors[index] }}>
				textformat
		</i>
		</button>
	)

	// Set the fontbuttons
	let fonts = ['Georgia', "Times New Roman", "Arial", "Arial Black", "Verdana"]
	let colors = ['green', 'blue', 'orange', 'purple', 'teal']
	let selectFonts = fonts.map((font, index) =>
		<button key={font} className="button button-raised button-large button-fill"
			style={{ display: 'flex', fontFamily: font, fontSize: '80px', height: '80px', margin: '0px 0px 10px 0px', backgroundColor: colors[index] }}
			onClick={() => {
				props.preferences.fontFamily = font
				changePreferences(props.dispatch, props.rendition, props.preferences)
			}}>
			{font}
		</button>
	)

	return (
		<div style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto', zIndex: 9999 }}>
			<div className={`dialog dialog-buttons-1 dialog-preloader modal-${(props.show === true) ? "in" : "out"}`} style={{ display: "block", left: 0, right: 0, top: '65%', margin: '0 auto', width: '90%' }}>
				<div className="dialog-inner" style={{ padding: '0.5em' }}>
					<Swiper spaceBetween={50} slidesPerView={1}>
						<SwiperSlide>
							<p className='row'>
								<button className="button button-raised button-large button-fill color-red text-color-white"
									id='smallerText'
									style={{ height: heightButtons, width: widthButtons, display: 'inline-block' }}
									onClick={() => {
										props.preferences.fontSize = props.preferences.fontSize - 2;
										changePreferences(props.dispatch, props.rendition, props.preferences)
									}}>
									<i className="f7-icons"
										style={{ fontSize: fontSizeButtons, transform: "rotateY(180deg)" }}>
										textformat_size
								</i>
								</button>
								<button className="button button-raised button-large button-fill color-green text-color-white"
									id='biggerText'
									style={{ height: heightButtons, width: widthButtons, display: 'inline-block' }}
									onClick={() => {
										props.preferences.fontSize = props.preferences.fontSize + 2;
										changePreferences(props.dispatch, props.rendition, props.preferences)
									}}>
									<i className="f7-icons" style={{ fontSize: fontSizeButtons }}>
										textformat_size
							</i>
								</button>
							</p>
						</SwiperSlide>
						<SwiperSlide>
							<p className='row' style={{ display: 'flex' }}>
								{themes}
							</p>
						</SwiperSlide>
						<SwiperSlide>
							<p className='row' style={{ 'justifyContent': 'center', display: 'block' }}>
								{selectFonts}
							</p>
						</SwiperSlide>
						<SwiperSlide>
							<p className='row' style={{ 'fontSize': '40px', display: 'inline-block' }}>
								Regelafstand:
							<button className="button button-raised button-large button-fill color-red text-color-white"
									style={{ height: '150px', width: '180px', display: 'inline-block' }}
									onClick={() => {
										if (props.preferences.lineHeight > 1) {
											props.preferences.lineHeight = props.preferences.lineHeight - 1;
											changePreferences(props.dispatch, props.rendition, props.preferences)
										}
									}}>
									<i className="f7-icons"
										style={{ fontSize: '150px' }}>
										arrow_down
								</i>
								</button>
								<button className="button button-raised button-large button-fill color-green text-color-white"
									style={{ height: '150px', width: '180px', display: 'inline-block', margin: '0px 20px 0px 20px' }}
									onClick={() => {
										if (props.preferences.lineHeight < 15) {
											props.preferences.lineHeight = props.preferences.lineHeight + 1;
											changePreferences(props.dispatch, props.rendition, props.preferences)
										}
									}}>
									<i className="f7-icons"
										style={{ fontSize: '150px' }}>
										arrow_up
								</i>
								</button>
							</p>
							<p className='row' style={{ 'fontSize': '40px', display: 'inline-block' }}>
								Letterafstand:
							<button className="button button-raised button-large button-fill color-red text-color-white"
									style={{ height: '150px', width: '180px', display: 'inline-block' }}
									onClick={() => {
										if (props.preferences.letterSpacing > -1) {
											props.preferences.letterSpacing = props.preferences.letterSpacing - 1;
											changePreferences(props.dispatch, props.rendition, props.preferences)
										}
									}}>
									<i className="f7-icons"
										style={{ fontSize: '150px' }}>
										arrow_down
								</i>
								</button>
								<button className="button button-raised button-large button-fill color-green text-color-white"
									style={{ height: '150px', width: '180px', display: 'inline-block', margin: '0px 20px 0px 20px' }}
									onClick={() => {
										if (props.preferences.letterSpacing < 15) {
											props.preferences.letterSpacing = props.preferences.letterSpacing + 1;
											changePreferences(props.dispatch, props.rendition, props.preferences)
										}
									}}>
									<i className="f7-icons"
										style={{ fontSize: '150px' }}>
										arrow_up
								</i>
								</button>
							</p>
						</SwiperSlide>
					</Swiper>
				</div>
				<div style={{ display: 'flex' }}>
					<div className="dialog-buttons" style={{ width: '45vw' }} onClick={() => {
						props.dispatch(showPreferencesDialog(false))
						changePreferences(props.dispatch, props.rendition, null, props.confirmedPreferences)
					}}>
						<span id='cancelButton' className="dialog-button dialog-button-bold">CANCEL</span>
					</div>
					<div className="dialog-buttons" style={{ width: '45vw' }} onClick={() => {
						props.dispatch(showPreferencesDialog(false))
						props.dispatch(confirmPreferences(props.preferences))
					}}>
						<span id='okButton' className="dialog-button dialog-button-bold">OK</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export function PreloaderModal(props) {
	return (
		<div>
			<div className={`dialog-backdrop backdrop-${(props.show === true) ? "in" : "out"}`}></div>
			<div className={`dialog dialog-no-buttons dialog-preloader modal-${(props.show === true) ? "in" : "out"}`} style={{ display: "block" }}>
				<div className="dialog-inner">
					{(props.title &&
						<div className="dialog-title">
							{props.title}
						</div>
					)}
					<Preloader ></Preloader>
				</div>
			</div>
		</div>
	)
}

export function DialogAlert(props) {
	return (
		<div>
			<div className={`dialog-backdrop backdrop-${(props.show === true) ? "in" : "out"}`}></div>
			<div className={`dialog dialog-buttons-1 dialog-preloader modal-${(props.show === true) ? "in" : "out"}`} style={{ display: props.show === true ? "block" : "none" }}>
				<div className="dialog-inner">
					{(props.title &&
						<div className="dialog-title">
							{props.title}
						</div>
					)}
					{(props.text &&
						<div className="dialog-text">
							{props.text}
						</div>
					)}
				</div>
				<div className="dialog-buttons" onClick={props.hide}>
					<span className="dialog-button dialog-button-bold">OK</span>
				</div>
			</div>
		</div>
	)
}

export function DialogPrompt(props) {
	return (
		<div className="dialog dialog-buttons-2 modal-in" style={{ display: "block", width: 'fit-content', margin: 'auto', left: 0, right: 0 }}>
			<div className="dialog-inner">
				<div className="dialog-title">Gebruikersnaam kiezen</div>
				<div className="dialog-text">Voer een gebruikersnaam in</div>
				<div className="dialog-input-field input">
					<input type="text" className="dialog-input" onInput={props.onInput} value={props.value} />
				</div>
			</div>
			<div className="dialog-buttons">
				<span className="dialog-button" onClick={props.onCancel}>Annuleer</span>
				<span className="dialog-button dialog-button-bold" onClick={props.onAccept}>OK</span>
			</div>
		</div>
	)
}

export function TabbarBottom(props) {

	const dispatch = useDispatch();

	const toggleMenu = () => {
		dispatch({ type: "TOGGLE_MENU" })
	}

	return (
		<div id='tabbar' className="tabbar" onClick={toggleMenu}>
			<i className="f7-icons">line_horizontal_3</i>
		</div>
	)

	// ========================= oude tabbar: ================================
	// return (
	// 	<Toolbar tabbar labels position='bottom'>
	// 		<Link href="/bookshelf" tabLink="#tab-1" text="Boekenkast" iconF7 = "rectangle_stack_fill" tabLinkActive={(props.active==="bookshelf") ? true : false} ></Link>
	// 		<Link href="/upload"  tabLink="#tab-2" text="Uploaden" iconF7 = "cloud_upload" tabLinkActive={(props.active==="upload") ? true : false} ></Link>
	// 		<Link href={`/book/${sessionStorage.bookID}`} tabLink="#tab-3" text="Boek" iconF7 = "book" tabLinkActive={(props.active==="book") ? true : false} ></Link>
	// 		{(sessionStorage.username === undefined)
	// 			? <Link href="/login" tabLink="#tab-4" text="Inloggen" iconF7 = "person_alt_circle" tabLinkActive={(props.active==="login") ? true : false} ></Link>
	// 			: <Link href="/account" tabLink="#tab-5" text="Account" iconF7 = "person_alt_circle_fill" tabLinkActive={(props.active==="account") ? true : false} ></Link>
	// 		}
	// 		<Link href="/settings" tabLink="#tab-6" text="Instellingen" iconF7 = "gear" tabLinkActive={(props.active==="settings") ? true : false} ></Link>
	// 	</Toolbar>
	// )
}

export function TabbarPopup(props) {

	const dispatch = useDispatch();
	const showMenu = useSelector(state => state.component.showMenu);
	const display = showMenu ? "flex" : "none";

	const toggleMenu = () => {
		dispatch({ type: "TOGGLE_MENU" })
	}

	return (
		<div className="popupbar" style={{display: display}} onClick={toggleMenu}>
			
			<div className="row">
				<Link href={`/book/${sessionStorage.bookID}`} >
					<i className="f7-icons" style={{color: "rgb(10,132,255)"}}>
						square_fill
					</i>
					&nbsp;
					<b>
						Boek Lezen
					</b>
				</Link>
				<Link id='settings' href="/settings" >
					<i className="f7-icons" style={{color: "yellow"}}>
						arrowtriangle_up_fill
					</i>
					&nbsp;
					<b>
						Instellingen
					</b>
				</Link>
			</div>
			
			<div className="row">
				<Link href="/bookshelf"  onClick={()=>dispatch({type: "SET_BOOKSHELF_STATUS", status: "unloaded"})}>
					<i className="f7-icons" style={{color: "red"}}>
						circle_fill
					</i>
					&nbsp;
					<b>
						Boekenkast
					</b>
				</Link>
				<Link href="/account" >
					<i className="f7-icons" style={{color: "#f760b1"}}>
						star_fill
					</i>
					&nbsp;
					<b>
						Account
					</b>
				</Link>
			</div>
			
			<div className="row">
				<Link href="/upload" >
					<i className="f7-icons" style={{color: "lime"}}>
						suit_diamond_fill
					</i>
					&nbsp;
					<b>
						Upload Boek
					</b>
				</Link>
				<Link  className="backbutton">
					<i className="f7-icons">
						xmark_square_fill
					</i>
					&nbsp;
					<b>
						Terug
					</b>
				</Link>
			</div>
		</div>
	)
}

export function Navigation() {

	const rendition = useSelector((state) => state.book.rendition);
	/**
	 Navigation makes de book render the previous or next page depending on the direction parameter and dispatches an action to the reducer to change the page number
	 */
	async function navigate(e, direction) {
		if (direction === 'NEXT') {
			await rendition.next()
			e.preventDefault()
		} else {
			await rendition.prev()
			e.preventDefault()
		}
	}
	return (
		<div>
			<div id="prev" onClick={(e) => navigate(e, 'PREV')} className="arrow">
				‹
			</div>
			<div id="next" onClick={(e) => navigate(e, 'NEXT')} className="arrow">
				›
			</div>
		</div>
	)
}

export function TopbarButton(props) {
	const childComponents = props.childs.map(child => {
		return (
			<div
				id={'topbar-' + props.position}
				className={'topbar-' + props.position}
				onClick={props.onClick}
				key={child}>
				<i key={child} id={child} className="f7-icons">
					{child}
				</i>
			</div>
		)
	})
	return (
		<div>
			{childComponents}
		</div>
	)
}