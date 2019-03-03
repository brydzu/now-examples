import { h } from 'preact';
import { Consumer } from '@grafoo/preact';
import style from './style';
import getQueryByRoutes from '../../utils/getQueryByRoutes';

const Home = () => (
	<div class={style.home}>
		<h1>Home</h1>
		<p>This is the Home component.</p>
		<Consumer query={getQueryByRoutes.home}>
			{props => <div>{props.pokemon && props.pokemon.name}</div>}
		</Consumer>
	</div>
);

export default Home;
