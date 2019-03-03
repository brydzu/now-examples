const { render: renderToString } = require('preact-render-to-string');
const { h } = require('preact');
const { readFileSync } = require('fs');
const createClient = require('@grafoo/core');
const getQueryParams = require('./src/utils/getQueryParams');
const fetch = require('isomorphic-fetch');

const bundle = require('./build/ssr-build/ssr-bundle');
const App = bundle.default;
const { getQueryByRoutes } = bundle;

const client = createClient(fetchQuery, { idFields: ['id'] });

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

const APP_RGX = /<div id="app"[^>]*>.*?(?=<script)/i;

module.exports = async (req, res) => {
	const queryParams = getQueryParams(req);
	const path = (queryParams && queryParams.path) || '';

	const template = readFileSync(
		`${__dirname}/build/${path}/index.html`,
		'utf8'
	);

	const variables = {};
	const query = /^profile/.test(path)
		? getQueryByRoutes.profile
		: getQueryByRoutes.home;
	const result = await client.execute(query, variables);
	await client.write(query, variables, result);

	res.setHeader('Content-Type', 'text/html');

	const body = renderToString(h(App, { url: path }));
	const withApp = template.replace(APP_RGX, body);
	const withGrafoo = withApp.replace(
		'_GRAFOO_INITIAL_STATE_;',
		`_GRAFOO_INITIAL_STATE_=${JSON.stringify(client.flush())};`
	);
	res.end(withGrafoo);
};
