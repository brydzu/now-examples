const { ApolloServer, gql } = require('apollo-server');

const HackerNews = require('./src/utils/hackerNews');

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

const server = new ApolloServer({
	typeDefs,
	resolvers,
	dataSources: () => ({
		HackerNews: new HackerNews(),
	}),
	introspection: true,
	playground: true,
});

server.listen({ port: 3000 }).then(({ url }) => {
	// eslint-disable-next-line no-console
	console.log(`🚀 Server ready at ${url}`);
});
