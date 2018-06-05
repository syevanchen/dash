import React, {	Component, PropTypes } from 'react'
import Modal from 'react-modal'
import classnames from 'classnames'
import Button from '../Button'
import s from './Dialog.scss'

export default class Dialog extends Component {

	static propTypes = {
		title: PropTypes.string,
		modalIsOpen: PropTypes.bool,
		closeModal: PropTypes.func,
		ok: PropTypes.func,
		okButtonName: PropTypes.string,
		hasHeader: PropTypes.bool,
		hasFooter: PropTypes.bool
	}

	static defaultProps = {
		title: '',
		modalIsOpen: false,
		okButtonName: '确认',
		hasHeader: true,
		hasFooter: true
	}

	render() {

		return (
			<Modal isOpen={this.props.modalIsOpen} className={s.modal} style={{overlay: { zIndex: 10 }, content: { zIndex: 20 }}}>
				{(() => {if (this.props.hasHeader) {
					return <header>{this.props.title}</header> 
				}})()}
				{this.props.children}
				{(() => {if (this.props.hasHeader) {
					return 	<footer><Button handle={this.props.ok}>{this.props.okButtonName}</Button><Button handle={this.props.closeModal}>取消</Button></footer>
				}})()}
			</Modal>
		)
	}
}