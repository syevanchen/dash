import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import autobind from 'autobind-decorator'
import fetch from '../../decorators/Fetch'
import Button from '../Button'
import s from './PageHeader.scss';

@fetch
export default class PageHeader extends Component {

	state = {
		login: false,
		username: ''
	}

	constructor(props) {
		super(props)
		props.fetch('/login-status', this.fetch)()
	}

	@autobind
	fetch(data) {
		this.setState({
			login: data.login,
			username: data.username
		}) 
	}

	render() {

		return 	<div className={s.root}>
					<img src="/i/logo.png" className={s.logo} />
					<div className={s.control}>
						<span className={classnames(s.username, {[s.hide]: !this.state.login})}>
							<i className="fa fa-user" aria-hidden="true"></i>&nbsp;&nbsp;<strong>{this.state.username}</strong>
						</span>
						<Button className={classnames(s.button, {[s.hide]: this.state.login})} 
								hoverClassName={s.hover}
								handle={(e) => window.location.href='/login'}>登入</Button>
						<Button className={classnames(s.button, {[s.hide]: !this.state.login})} 
								hoverClassName={s.hover}
								handle={(e) => window.location.href='/logout'}>登出</Button>
					</div>
				</div>
	}
}
