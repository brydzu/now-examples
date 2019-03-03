const { RESTDataSource } = require('apollo-datasource-rest');

class HackerNews extends RESTDataSource {
	constructor() {
		super();

		this.baseURL = 'https://hacker-news.firebaseio.com';
	}

	// https://github.com/HackerNews/API#items
	item({ id }) {
		return this.get(`/v0/item/${id.toString()}.json?print=pretty`);
	}
}

module.exports = HackerNews;
