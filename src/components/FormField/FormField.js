import React, {	Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import classnames from 'classnames'
import s from './FormField.scss'
	
const TYPE = {
	NUMBER: 1,
	TEXT: 	2,
	RADIO: 	3,
	LIST: 	4,
	SWITCH: 5,
	PASS:   6,
	SELECT: 7,
	ARRAY:  8
}

export default class FormField extends Component {

	static propTypes = {
		label: PropTypes.string.isRequired,
		labelIsHidden: PropTypes.bool,
		type: PropTypes.number.isRequired,
		comment: PropTypes.string,
		min: PropTypes.number,
		max: PropTypes.number,
		step: PropTypes.number,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
		valueChangeCallback: PropTypes.func,
		map: PropTypes.arrayOf(PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			displayName: PropTypes.string.isRequired
		})),
		radioExt: PropTypes.bool,
		radioExtType: PropTypes.string,
		radioExtUnit: PropTypes.string,
		list: PropTypes.arrayOf(PropTypes.shape({
			key: PropTypes.string,
			value: PropTypes.string,
			plusCallback: PropTypes.func,
			minusCallback: PropTypes.func,
			keyChangeCallback: PropTypes.func,
			valueChangeCallback: PropTypes.func
		}))
	}

	static defaultProps = {
		label: '',
		labelIsHidden: false,
		type: TYPE.NUMBER,
		min: 0,
		max: Number.MAX_VALUE,
		step: 1,
		radioExt: false
	}

	render() {

		return (
			<section className={s.root}>
				<label className={classnames(s.label, {[s.hide]: this.props.labelIsHidden,
													   [s.type5label]: this.props.type === TYPE.SWITCH})}>{this.props.label}</label>
				{(() => {
					switch(this.props.type) {
					case TYPE.NUMBER:
						return 	<div>
									<input type="number" 
										   className={s.number} 
										   min={this.props.min} 
										   max={this.props.max} 
										   step={this.props.step} 
										   value={this.props.value}
										   onChange={this.props.valueChangeCallback} />
									<span className={s.comment}>{this.props.comment}</span>
								</div>
					case TYPE.TEXT:
						return <input type="text" className={s.text} value={this.props.value} onChange={this.props.valueChangeCallback} />
					case TYPE.RADIO:
						return 	<span>
									{this.props.map.map((radio, index) => {
										return 	<span key={index} className={s.radio}>
													<input type="radio" 
													       name={s.radio} 
													       className={s.radiobtn} 
													       value={radio.value} 
													       checked={this.props.value == radio.value}
													       onChange={this.props.valueChangeCallback} />
													{radio.displayName}
												</span>
									})}
									{this.props.radioExt ? 
										<span className={s.radio}>
											自定义
											<input type={this.props.radioExtType} 
												   className={s.radioext} 
												   value={this.props.value}
												   onChange={this.props.valueChangeCallback} />
											{this.props.radioExtUnit}
										</span> : <span />
									}
								</span>
					case TYPE.LIST:
						return 	<div>
									{this.props.list.map((env, index) => {
										if (index == 0) {
										 	return 	<div key={index}>
														<input type="text" className={s.envinput} value={env.key} data-index={index} onChange={env.keyChangeCallback} />
														<span className={s.equal}>=</span>
														<input type="text" className={s.envinput} value={env.value} data-index={index} onChange={env.valueChangeCallback} />
														<i className={classnames('fa', 'fa-plus-circle', 'fa-2x', s.envbtn)} aria-hidden="true" data-index={index} onClick={env.plusCallback}></i>
												 	</div>
										} else {
											return	<div key={index}>
														<input type="text" className={s.envinput} value={env.key} data-index={index} onChange={env.keyChangeCallback} />
														<span className={s.equal}>=</span>
														<input type="text" className={s.envinput} value={env.value} data-index={index} onChange={env.valueChangeCallback} />
														<i className={classnames('fa', 'fa-plus-circle', 'fa-2x', s.envbtn)} aria-hidden="true" data-index={index} onClick={env.plusCallback}></i>
														<i className={classnames('fa', 'fa-minus-circle', 'fa-2x', s.envbtn)} aria-hidden="true" data-index={index} onClick={env.minusCallback}></i>
													</div>
										}
									})}
								</div>
					case TYPE.SWITCH:
						return <div className={s.switch}>
    						<input type="checkbox" id={s.switchcheckbox} className={s.switchcheckbox} checked={this.props.value} onChange={this.props.valueChangeCallback} />
    						<label className={s.switchlabel} htmlFor={s.switchcheckbox}>
        						<span className={s.switchinner}></span>
        						<span className={s.switchswitch}></span>
    						</label>
						</div>
					case TYPE.PASS:
						return <input type="password" className={s.text} value={this.props.value} onChange={this.props.valueChangeCallback} />
					case TYPE.SELECT:
						return <select className={s.select} value={this.props.value} onChange={this.props.valueChangeCallback}>
									{this.props.map.map((option, index) => {
										return 	<option key={index} value={option.value}>{option.displayName}</option>
									})}
								</select>
					case TYPE.ARRAY:
						return <div>
									{this.props.list.map((item, index) => {
										if (index == 0) {
										 	return 	<div key={index}>
														<input type="text" className={s.iteminput} value={item.value} data-index={index} onChange={item.valueChangeCallback} />
														<i className={classnames('fa', 'fa-plus-circle', 'fa-2x', s.envbtn)} aria-hidden="true" data-index={index} onClick={item.plusCallback}></i>
												 	</div>
										} else {
											return	<div key={index}>
														<input type="text" className={s.iteminput} value={item.value} data-index={index} onChange={item.valueChangeCallback} />
														<i className={classnames('fa', 'fa-plus-circle', 'fa-2x', s.envbtn)} aria-hidden="true" data-index={index} onClick={item.plusCallback}></i>
														<i className={classnames('fa', 'fa-minus-circle', 'fa-2x', s.envbtn)} aria-hidden="true" data-index={index} onClick={item.minusCallback}></i>
													</div>
										}
									})}
								</div>
					default:
					}
				})()}
			</section>
		)
	}
}