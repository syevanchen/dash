import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import Tab from '../Tab'
import s from './TabsHeader.scss';

export default class TabsHeader extends Component {

	static propTypes = {
		name: PropTypes.string.isRequired,
		status: PropTypes.string,
		reloadHandler: PropTypes.func,
		fallbackHandler: PropTypes.func,
		tabs: PropTypes.arrayOf(PropTypes.shape({
			title: PropTypes.string.isRequired,
			href: PropTypes.string
		}))
	};

	static defaultProps = {
		name: 'UNSPECIFIED',
		reloadHandler: (e) => undefined,
		fallbackHandler: undefined,
		tabs: []
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
					<div className={s.title} title={this.props.name}>实例：{this.props.name}</div>
					<div className={classnames(s.status, statusClassName)}>{this.props.status}</div>
					{
						this.props.tabs.map(tab => {
							return <Tab key={tab.title} 
										link={tab.href} 
										className={s.tab}
										activeClassName={s.active}>{tab.title}</Tab>
						})
					}
				</div>
				<div className={s.right}>
					{(() => { if (this.props.fallbackHandler) return (
						<button className={s.button} onClick={this.props.fallbackHandler} title="返回">
							<i className="fa fa-share fa-flip-horizontal" aria-hidden="true" />
						</button>
					)})()}
					<button className={s.button} onClick={this.props.reloadHandler} title="刷新">
						<i className="fa fa-undo" aria-hidden="true" />
					</button>
				</div>
			</div>
		)
	}
}
