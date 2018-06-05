import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import autobind from 'autobind-decorator'
import hover from '../../decorators/Hover'
import SideTabItem from '../SideTabItem'
import s from './SideTab.scss'

@hover
export default class SideTab extends Component {

	static propTypes = {
		menu: PropTypes.arrayOf(PropTypes.string),
		isActive: PropTypes.func
	}

	static defaultProps = {
		menu: [],
		isActive: (num) => undefined
	}

	state = {
		activeNum: 0
	}

	@autobind
	select(e, index) {
		this.setState({
			activeNum: index
		})
		this.props.isActive(index)
	}

	render() {

		return (
			<div className={s.root}>
				<div className={s.sidebar}>
				{this.props.menu.map((item, idx) => {
					return <SideTabItem key={idx} index={idx} isActive={this.state.activeNum === idx} select={this.select}>{item}</SideTabItem>
				})}
				</div>
				<div className={s.content}>
					{this.props.children}
				</div>
			</div>
		)
	}
}