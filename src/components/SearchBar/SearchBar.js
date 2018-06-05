import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import autobind from 'autobind-decorator'
import s from './SearchBar.scss';

export default class SearchBar extends Component {

	@autobind
	change(e) {
		this.refs.button.value = this.refs.input.value;
	}

	static propTypes = {
		searchHandler: PropTypes.func
	};

	static defaultProps = {
		searchHandler: (e) => undefined
	};

	render() {

		return (
			<div className={s.root}>
				<div className={s.wrapper}>
					<span className={s.icon}><i className="fa fa-search" aria-hidden="true"></i></span>
					<input className={s.input} type="text" ref="input" placeholder="Search..." onChange={this.change} />
					<button className={s.button} type="button" name="query" ref="button" value="" onClick={this.props.searchHandler}>搜索</button>
				</div>
			</div>
		)
	}
}
