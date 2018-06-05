import React, {	Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import hover from '../../decorators/Hover'
import shrink from '../../decorators/Shrink'
import s from './Dropdown.scss'

@hover
@shrink
export default class Dropdown extends Component {

	static propTypes = {
		groupId: PropTypes.string,
		title: PropTypes.string.isRequired,
		titleClassName: PropTypes.string,
		hoverClassName: PropTypes.string,
		plus: PropTypes.func
	}

	static defaultProps = {
		groupId: '',
		title: 'UNSPECIFIED',
		titleClassName: s.title,
		hoverClassName: s.hover,
		plus: (e) => undefined
	}

	render() {

		return (
			<div>
				<div className={classnames(this.props.titleClassName, {[this.props.hoverClassName]: this.props.isHover})}
			   	  	 onMouseOver={this.props.handleMouseOver}
				  	 onMouseOut={this.props.handleMouseOut}>
					<i className={`fa fa-caret-${this.props.isHover ? 'right' : this.props.isShrink ? 'up' : 'down'}`} aria-hidden="true"></i>
					<span onClick={this.props.handleShrink}>{this.props.title}</span>
					<i className={`fa fa-plus ${s.plus}`} onClick={this.props.plus} data-group-id={this.props.groupId} data-group-name={this.props.title} aria-hidden="true"></i>
				</div>
				<div className={this.props.isShrink ? s.hide : ''}>
					{this.props.children}
				</div>
			</div>
		)
	}
}