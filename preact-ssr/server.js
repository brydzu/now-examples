const { render: renderToString } = require('preact-render-to-string');
const { h } = require('preact');
const { readFileSync } = require('fs');
const createClient = require('@grafoo/core');
const getQueryParams = require('./src/utils/getQueryParams');
const fetch = require('isomorphic-fetch');

const bundle = require('./build/ssr-build/ssr-bundle');
const App = bundle.default;
const { getGraphqlQueriesByRoutes } = bundle;

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

const homeTemplate = readFileSync(`${__dirname}/build/index.html`, 'utf8');
const profileTemplate = readFileSync(
	`${__dirname}/build/profile/index.html`,
	'utf8'
);
const profileJohnTemplate = readFileSync(
	`${__dirname}/build/profile/index.html`,
	'utf8'
);
const notFoundTemplate = readFileSync(
	`${__dirname}/build/404/index.html`,
	'utf8'
);

function buildRoutePayload(queryParams = { path: '/' }) {
	const path = decodeURIComponent(queryParams.path);
	if (/^profile\/john/.test(path)) {
		return {
			url: queryParams.path,
			template: profileJohnTemplate,
			graphqlQuery: getGraphqlQueriesByRoutes.profile,
			variables: {},
		};
	} else if (/^profile/.test(path)) {
		return {
			url: queryParams.path,
			template: profileTemplate,
			graphqlQuery: getGraphqlQueriesByRoutes.profile,
			variables: {},
		};
	} else if (/^404/.test(path)) {
		return {
			url: queryParams.path,
			template: notFoundTemplate,
		};
	}

	return {
		url: queryParams.path,
		template: homeTemplate,
		graphqlQuery: getGraphqlQueriesByRoutes.home,
		variables: {},
	};
}

const APP_RGX = /<div id="app"[^>]*>.*?(?=<script)/i;

module.exports = async (req, res) => {
	const queryParams = getQueryParams(req);
	const routePayload = buildRoutePayload(queryParams);

	const client = createClient(fetchQuery, { idFields: ['id'] });

	if (routePayload.graphqlQuery) {
		const query = routePayload.graphqlQuery;
		const variables = routePayload.variables;
		const result = await client.execute(query, variables);
		await client.write(query, variables, result);
	}

	res.setHeader('Content-Type', 'text/html');

	const body = renderToString(h(App, { url: routePayload.url }));
	const withApp = routePayload.template.replace(APP_RGX, body);
	const withGrafoo = withApp.replace(
		'_GRAFOO_INITIAL_STATE_;',
		`_GRAFOO_INITIAL_STATE_=${JSON.stringify(client.flush())};`
	);
	res.end(withGrafoo);
};
