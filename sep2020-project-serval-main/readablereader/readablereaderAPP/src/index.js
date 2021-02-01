import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import * as ReactRedux from 'react-redux';
import { mainReducer } from './Reducers/reducers';

// Import F7 Bundle
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';

// Import F7-React Plugin
import Framework7React from 'framework7-react';
import 'framework7/css/framework7.bundle.min.css';
import 'framework7-icons/css/framework7-icons.css';

// Init F7-React Plugin
Framework7.use(Framework7React);

export const theStore = createStore(mainReducer, applyMiddleware(thunk));
export const apiURL = "http://localhost:3001/api/v1";

ReactDOM.render(
	<ReactRedux.Provider store={theStore}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ReactRedux.Provider>,
	document.getElementById('root')
);