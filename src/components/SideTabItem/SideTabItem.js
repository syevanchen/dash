import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import hover from '../../decorators/Hover'
import s from './SideTabItem.scss'

@hover
export default class SideTabItem extends Component {

	static propTypes = {
		isActive: PropTypes.bool,
		index: PropTypes.number,
		select: PropTypes.func
	}

	static defaultProps = {
		isActive: false,
		index: 0,
		select: (e) => undefined
	}

	render() {

		return <span className={classnames(s.item, {[s.hover]: this.props.isHover, [s.active]: this.props.isActive})}
					 onMouseOver={this.props.handleMouseOver}
					 onMouseOut={this.props.handleMouseOut}
					 onClick={(e) => {e.preventDefault(); if (!this.props.isActive) this.props.select(e, this.props.index)}}>{this.props.children}</span>
	}
}