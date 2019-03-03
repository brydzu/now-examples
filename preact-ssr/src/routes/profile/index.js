import { h, Component } from 'preact';
import { Consumer } from '@grafoo/preact';
import style from './style';
import getQueryByRoutes from '../../utils/getQueryByRoutes';

export default class Profile extends Component {
	state = {
		time: Date.now(),
		count: 10,
	};

	// update the current time
	updateTime = () => {
		this.setState({ time: Date.now() });
	};

	increment = () => {
		this.setState({ count: this.state.count + 1 });
	};

	// gets called when this route is navigated to
	componentDidMount() {
		// start a timer for the clock:
		this.timer = setInterval(this.updateTime, 1000);
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count }) {
		return (
			<div class={style.profile}>
				<h1>Profile: {user}</h1>
				<p>This is the user profile for a user named {user}.</p>

				<Consumer query={getQueryByRoutes.profile}>
					{props => <div>{props.pokemon && props.pokemon.name}</div>}
				</Consumer>
			</div>
		);
	}
}
