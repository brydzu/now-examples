import { h, Component } from 'preact';
import { Router } from 'preact-router';
import createClient from '@grafoo/core';
import { Provider } from '@grafoo/preact';

import Header from './header';

function fetchQuery(query, variables) {
	const init = {
		method: 'POST',
		body: JSON.stringify({ query, variables }),
		headers: {
			'content-type': 'application/json',
		},
	};

	return fetch('https://graphql-pokemon.now.sh', init).then(res => res.json());
}

let client;
if (typeof window !== 'undefined') {
	const initialState = window._GRAFOO_INITIAL_STATE_ || {};
	client = createClient(fetchQuery, {
		initialState,
		idFields: ['id'],
	});
} else {
	client = createClient(fetchQuery, {
		idFields: ['id'],
	});
}

// Code-splitting is automated for routes
import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFound from '../routes/404';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.setState({
			currentUrl: e.url,
		});
	};

	render() {
		return (
			<div id="app">
				<Header selectedRoute={this.state.currentUrl} />
				<Provider client={client}>
					<Router onChange={this.handleRoute}>
						<Home path="/" />
						<Profile path="/profile/" user="me" />
						<Profile path="/profile/:user" />
						<NotFound default />
					</Router>
				</Provider>
			</div>
		);
	}
}
