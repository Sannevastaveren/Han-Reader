import React from 'react';

import { Home } from './pageComponents/home.jsx';
import { Bookshelf } from './pageComponents/bookshelf'
import { Account } from './pageComponents/account'
import { Changepass } from './pageComponents/changepass'
import { Upload } from './pageComponents/upload';
import { Login } from './pageComponents/login';
import { Create } from './pageComponents/create';
import { Testlogin} from './pageComponents/testLogin';
import Settings from './pageComponents/settings';

import { App, View } from 'framework7-react';

import Book  from './pageComponents/book';

import {googleSignOut} from './functions';
import {theStore} from "./index";


import './pageComponents/config.css';
import { useDispatch, useSelector } from 'react-redux';

import {loadPreferences} from './Actions/bookActions';


// returnt true als je authenticated bent
const auth = () => {
	return sessionStorage.username!==undefined;
}

const f7params = {
	name: 'My App',
	id: 'root',
	view: {
        pushState: true,
        pushStateSeparator: ''
    },
	routes: [
		{
			path: '/login',
			component: Login,
		},
		{
			path: '/book/:bookID',
			component: Book,
			beforeEnter(to, from, resolve, reject) {
				if(!auth()) {
					reject();
					this.navigate('/login');
				} else resolve();
			},
			on: {
				pageBeforeOut: async function (e, page) {
					if(theStore.getState().book.currentChapter.currentPage === 0 ){
						console.log('something is wrong')
					}else{
						try {
							await fetch(`http://localhost:3001/api/v1/users/${sessionStorage.username}/books/${sessionStorage.bookID}/currentLocation`, {
								method: 'PATCH',
								body: JSON.stringify(theStore.getState().book.currentChapter),
								headers: {
									'Content-Type': 'application/json'
								}
							})
						} catch(err) {
							console.log(err)
						}
					}
				},
			}
		},
		{
			path: '/bookshelf',
			component: Bookshelf,
			beforeEnter(to, from, resolve, reject) {
				if(!auth()) {
					reject();
					this.navigate('/login');
				} else resolve();
			},
		},
		{
			path: '/account',
			component: Account,
			beforeEnter(to, from, resolve, reject) {
				if(!auth()) {
					reject();
					this.navigate('/login');
				} else resolve();
			},
		},
		{
			path: '/changepass',
			component: Changepass,
			beforeEnter(to, from, resolve, reject) {
				if(!auth()) {
					reject();
					this.navigate('/login');
				} else resolve();
			},
		},
		{
			path: '/upload',
			component: Upload,
			beforeEnter(to, from, resolve, reject) {
				if(!auth()) {
					reject();
					this.navigate('/login');
				} else resolve();
			},
		},
		{
			path: '/settings',
			component: Settings
		},
		{
			path: '/create',
			component: Create
		},
		{
			path: '/testlogin',
			component: Testlogin,
		},
		{
			path: '/logout',
			redirect: function (route, resolve, reject) {
				sessionStorage.clear()
				window.gapi.load('auth2', async () => {
					googleSignOut()
				})
				resolve('/login');
			}
		},
		{
			path: '/',
			component: Home,
		}
	]
};


const Appcomponent = props => {

	const dispatch = useDispatch();

	if (useSelector(state=>state.book.preferencesStatus)==="unloaded") dispatch(loadPreferences())
	const fontSize = useSelector(state => state.book.preferences.fontSize);

	return (
		<App params={f7params} style={{'--fontSize-title': fontSize?`${48-(48-fontSize)*0.5}px`:'3rem'}}>
			<View main url="/" />
		</App>
	);
}

export default Appcomponent;