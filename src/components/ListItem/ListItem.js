import React, {	Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import hover from '../../decorators/Hover'
import s from './ListItem.scss'

@hover
export default class ListItem extends Component {

	static propTypes = {
		icon: PropTypes.string,
		name: PropTypes.string.isRequired,
		href: PropTypes.string,
		className: PropTypes.string,
		hoverClassName: PropTypes.string,
		activeClassName: PropTypes.string,
		disableClassName: PropTypes.string,
		actived: PropTypes.bool,
		disable: PropTypes.bool,
		hidden: PropTypes.bool,
		configurable: PropTypes.bool,
		config: PropTypes.func
	}

	static defaultProps = {
		name: 'UNSPECIFIED',
		href: '#',
		className: s.item,
		hoverClassName: s.hover,
		activeClassName: s.active,
		disableClassName: s.disable,
		actived: false,
		disable: false,
		hidden: false,
		configurable: false,
		config: (e, serviceId) => undefined
	}

	render() {

		if (this.props.hidden) {
			return <span />
		} else {
			return (
				<Link className={classnames(this.props.className, 
										  {[this.props.hoverClassName]: !this.props.disable && this.props.isHover,
										   [this.props.disableClassName]: this.props.disable})} 
				   	  to={this.props.href}
				   	  onClick={(e) => {if (this.props.disable) e.preventDefault()}}
				   	  onMouseOver={this.props.disable ? () => undefined : this.props.handleMouseOver}
					  onMouseOut={this.props.disable ? () => undefined : this.props.handleMouseOut}
					  onlyActiveOnIndex={this.props.disable ? false : this.props.actived}
					  activeClassName={this.props.disable ? '' : this.props.activeClassName}>
					<i className={classnames('fa', 'fa-lg', {[`fa-${this.props.icon}`]: this.props.icon})} aria-hidden="true"></i>
					<span>{this.props.name}</span>
					{ this.props.configurable ? <i 	className={`fa fa-cog ${s.cog}`}
													aria-hidden="true"
													onClick={(e) => {e.preventDefault(); this.props.config(e, this.props.href)}}></i> : <i></i> }
				</Link>
			)
		}
	}
}