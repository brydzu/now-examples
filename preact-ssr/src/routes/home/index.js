import { h } from 'preact';
import { Consumer } from '@grafoo/preact';
import style from './style';
import getGraphqlQueriesByRoutes from '../../utils/getGraphqlQueriesByRoutes';

const Home = () => (
	<div class={style.home}>
		<h1>Home</h1>
		<p>This is the Home component.</p>
		<Consumer query={getGraphqlQueriesByRoutes.home}>
			{props => <div>{props.pokemon && props.pokemon.name}</div>}
		</Consumer>
	</div>
);

export default Home;
