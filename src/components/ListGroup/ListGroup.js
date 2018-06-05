import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './ListGroup.scss'

export default class ListGroup extends Component {

	static propTypes = {
		title: PropTypes.string.isRequired,
		titleClassName: PropTypes.string
	}

	static defaultProps = {
		title: 'UNSPECIFIED',
		titleClassName: s.title
	}

	render() {

		return (
			<div>
				<div className={this.props.titleClassName}>
					<i className='fa fa-lg'></i><span>{this.props.title}</span>
				</div>
				<div>
					{this.props.children}
				</div>
			</div>
		)
	}
}