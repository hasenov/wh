class FloatLabel {
	constructor() {
		this.floatContainers = document.querySelectorAll('.control-field_js');
	}
	init() {
		this.floatContainers.forEach((element) => {
			if (element.querySelector('.control-field__control').value) {
				element.classList.add('active');
			} else {
				element.classList.remove('active');
			}

			this.bindEvents(element);
		});
	}
	handleFocus(e) {
		const target = e.target;
		target.closest('.control-field_js').classList.add('active');
		target.closest('.control-field_js').classList.add('gradient-border');
	}
	handleBlur(e) {
		const target = e.target;
		if(!target.value) {
			target.closest('.control-field_js').classList.remove('active');
		}
		target.closest('.control-field_js').classList.remove('gradient-border');
	}
	bindEvents(element) {
		const floatField = element.querySelector('.control-field__control');
		floatField.addEventListener('focus', (e) => this.handleFocus(e));
		floatField.addEventListener('blur', (e) => this.handleBlur(e));
	}
}

const floatLabel = new FloatLabel();

export default floatLabel;