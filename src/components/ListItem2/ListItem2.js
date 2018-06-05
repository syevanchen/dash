import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import autobind from 'autobind-decorator'
import s from './ListItem2.scss'

export default class ListItem2 extends Component {

	static propTypes = {
		date: PropTypes.string.isRequired,
		message: PropTypes.string.isRequired,
		detail: PropTypes.string
	}

	static defaultProps = {
		date: '0.0',
		message: 'UNSPECIFIED'
	}

	state = {
		showDetail: false
	}

	render() {

		return (
			<li className={`${s.first} ${s.item}`}>
				<i></i>
				<span>{this.props.date}</span>
				<a href="javascript: void(0);" className={classnames({[s.strong]:this.state.showDetail})} onClick={this.handleClick}>{this.props.message}</a>
				<div className={classnames(s.detail, {[s.hide]:!this.state.showDetail})}>{this.props.detail}</div>
			</li>
		)
	}

	@autobind
	handleClick(e) {
		this.setState({
			showDetail: !this.state.showDetail
		})
	}
}