import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './Sidebar.scss'
import shrink from '../../decorators/Shrink'

@shrink
export default class Sidebar extends Component {

	static propTypes = {
		className: PropTypes.string,
		shrinkerClassName: PropTypes.string,
		expandClassName: PropTypes.string,
		shrinkClassName: PropTypes.string
	}

	static defaultProps = {
		className: s.bar,
		shrinkerClassName: s.shrinker,
		expandClassName: s.expand,
		shrinkClassName: s.shrink
	}

	render() {

		return (
			<div className={classnames(this.props.className, `${this.props.isShrink ? this.props.shrinkClassName : this.props.expandClassName}`)}>
				<div className={s.panel}>
					<div className={this.props.shrinkerClassName} onClick={this.props.handleShrink}>
						<span><i className={classnames('fa', `${this.props.isShrink ? 'fa-chevron-right' : 'fa-chevron-left'}`)} aria-hidden="true"></i></span>
					</div>
					{this.props.children}
				</div>
			</div>
		)
	}
}