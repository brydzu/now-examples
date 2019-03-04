const cors = require('micro-cors')();
const { ApolloServer, gql } = require('apollo-server-micro');

const HackerNews = require('./hackerNews');

const typeDefs = gql`
	enum ItemType {
		job
		story
		comment
		poll
		pollopt
	}

	type Item {
		id: ID
		type: ItemType
	}

	type Query {
		item(id: ID): Item
	}
`;

const resolvers = {
	Query: {
		item: async (_, { id }, { dataSources }) =>
			dataSources.HackerNews.item({ id }),
	},
};

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	dataSources: () => ({
		HackerNews: new HackerNews(),
	}),
	introspection: true,
	playground: true,
});

module.exports = cors(apolloServer.createHandler({ path: '/api' }));
