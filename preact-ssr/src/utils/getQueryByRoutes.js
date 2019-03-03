import gql from '@grafoo/core/tag';

export const PIKACHU_QUERY = gql`
	query {
		pokemon(name: "Pikachu") {
			id
			name
		}
	}
`;

export const BULBASAUR_QUERY = gql`
	query {
		pokemon(name: "Bulbasaur") {
			id
			name
		}
	}
`;

export default {
	home: PIKACHU_QUERY,
	profile: BULBASAUR_QUERY,
};
