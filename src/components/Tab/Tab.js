import React, {	Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import s from './Tab.scss'

export default class Tab extends Component {

	static propTypes = {
		link: PropTypes.string.isRequired,
		className: PropTypes.string,
		activeClassName: PropTypes.string,
		actived: PropTypes.bool
	}

	static defaultProps = {
		link: '#',
		className: undefined,
		activeClassName: undefined,
		actived: false
	}

	render() {

		return (
			<Link className={classnames(s.root, {[this.props.className]: this.props.className})} 
			   	  to={this.props.link}
				  onlyActiveOnIndex={this.props.actived}
				  activeClassName={classnames(s.active, {[this.props.activeClassName]: this.props.activeClassName})}>
				{this.props.children}
			</Link>
		)
	}
}