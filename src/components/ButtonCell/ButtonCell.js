import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import Button from '../Button'
import s from './ButtonCell.scss'

export default class ButtonCell extends Component {

	render() {

		return (
			<td className={s.cell}>
				{this.props.children}
			</td>
		)
	}
}