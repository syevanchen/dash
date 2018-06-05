import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './ComboBox.scss';

export default class ComboBox extends Component {

	static propTypes = {
		name: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		options: PropTypes.arrayOf(PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			displayName: PropTypes.string
		})),
		selectHandler: PropTypes.func
	};

	static defaultProps = {
		label: 'UNDEFINED',
		options: [],
		selectHandler: (e) => undefined
	};

	render() {

		return (
			<div className={s.root}>
				<span className={s.label}>{this.props.label}</span>
				<select name={this.props.name} className={s.select} onChange={this.props.selectHandler}>
					{
						this.props.options.map(option => {
							return <option key={option.value} value={option.value}>{option.displayName}</option>
						})
					}
				</select>
			</div>
		)
	}
}
