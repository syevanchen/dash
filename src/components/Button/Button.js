import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import hover from '../../decorators/Hover'
import s from './Button.scss'

@hover
export default class Button extends Component {

	static propTypes = {
		handle: PropTypes.func,
		className: PropTypes.string,
		hoverClassName: PropTypes.string,
		disableClassName: PropTypes.string,
		disable: PropTypes.bool
	}

	static defaultProps = {
		handle: (e) => undefined,
		className: s.button,
		hoverClassName: s.hover,
		disableClassName: s.disable,
		disable: false
	}

	render() {

		return (
			<div className={classnames(this.props.className, 
									  {[this.props.hoverClassName]: !this.props.disable && this.props.isHover,
									   [this.props.disableClassName]: this.props.disable})}
				 onMouseOver={this.props.disable ? (e) => undefined : this.props.handleMouseOver}
				 onMouseOut={this.props.disable ? (e) => undefined : this.props.handleMouseOut}
				 onClick={this.props.handle}>
				{this.props.children}
			</div>
		)
	}
}

// <div className={classnames(this.props.className, 
// 						  {[this.props.hoverClassName]: !this.props.disable && this.props.isHover,
// 						   [this.props.disableClassName]: this.props.disable})}
// 	 onClick={(e) => {if (this.props.disable) e.preventDefault() else this.props.handle(e)}}
// 	 onMouseOver={this.props.disable ? () => undefined : this.props.handleMouseOver}
// 	 onMouseOut={this.props.disable ? () => undefined : this.props.handleMouseOut}>
// 	{this.props.children}
// </div>