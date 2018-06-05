import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './ContentHeader.scss';

export default class ContentHeader extends Component {

	static propTypes = {
		name: PropTypes.string.isRequired,
		status: PropTypes.string,
		handle: PropTypes.func
	};

	static defaultProps = {
		name: '',
		status: '',
		handle: (e) => undefined
	};

	render() {

		let statusClassName = s.offline
		switch(this.props.status) {
		case 'UP':
			statusClassName = s.up
			break
		case 'DOWN':
			statusClassName = s.down
			break			
		case 'PAUSE': // pause
			statusClassName = s.pause
			break
		default: // unknown
			// empty
		}

		return (
			<div className={s.root}>
				<div className={s.left}>
					<span className={s.title}>服务:{this.props.name}</span>
					<span className={classnames(s.status, statusClassName)}>{this.props.status}</span>
				</div>
				<div className={s.right}>
					<button className={s.button} onClick={this.props.handle} title="刷新">
						<i className="fa fa-undo" aria-hidden="true" />
					</button>
				</div>
			</div>
		)
	}
}
