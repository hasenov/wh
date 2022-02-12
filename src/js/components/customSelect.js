const CLASS_NAME_SELECT = 'custom-select';
const CLASS_NAME_ACTIVE = 'custom-select_show';
const CLASS_NAME_SELECTED = 'custom-select__option_selected';
const CLASS_NAME_DISABLED = 'custom-select__option_disabled';
const SELECTOR_ACTIVE = '.custom-select_show';
const SELECTOR_DATA = '[data-select]';
const SELECTOR_DATA_TOGGLE = '[data-select="toggle"]';
const SELECTOR_OPTION_SELECTED = '.custom-select__option_selected';

export default class CustomSelect {
  constructor(target, params, isSizingSelect) {
    if(isSizingSelect) {
      this._elRoot = document.body
      this._elRootSizing = typeof target === 'string' ? document.querySelector(target) : target;
    } else {
      this._elRoot = typeof target === 'string' ? document.querySelector(target) : target;
    }
    this._isSizing = isSizingSelect;
    this._params = params || {};
    if (this._params['options']) {
      this._elRoot.classList.add(CLASS_NAME_SELECT);
      this._elRoot.innerHTML = CustomSelect.template(this._params);
    }
    this._elToggle = this._elRoot.querySelector(SELECTOR_DATA_TOGGLE);
    this._elRoot.addEventListener('click', this._onClick.bind(this));
    this._elInput = this._elRoot.querySelector('.custom-select__input');
  }
  _onClick(e) {
    const target = e.target;
    const type = target.closest(SELECTOR_DATA).dataset.select;
    switch (type) {
      case 'toggle':
        this.toggle();
        break;
      case 'option':
        this._changeValue(target.closest('.custom-select__option'));
        break;
    }
  }
  _update(option) {
    const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
    if (selected) {
      selected.classList.remove(CLASS_NAME_SELECTED);
    }
    option.classList.add(CLASS_NAME_SELECTED);
    if(this._params.isSizingSelect) {
        this._elToggle.innerHTML = option.querySelector('.sizing-select__values') ? option.querySelector('.sizing-select__values').outerHTML : option.textContent;
        document.querySelector('.sizing-product__output.active')?.classList.remove('active');
        document.querySelector(`#tip${option.dataset['value']}`)?.classList.add('active');
    } else {
        this._elToggle.textContent = option.textContent;
    }
    this._elToggle.value = option.dataset['value'];
    this._elToggle.dataset.index = option.dataset['index'];
    this._elInput.value = option.dataset['value'];
    this._elRoot.dispatchEvent(new CustomEvent('select.change'));
    this._params.onSelected ? this._params.onSelected(this, option) : null;
    return option.dataset['value'];
  }
  _reset() {
    const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
    if (selected) {
      selected.classList.remove(CLASS_NAME_SELECTED);
    }
    this._elToggle.textContent = 'Выберите из списка';
    this._elToggle.value = '';
    this._elToggle.dataset.index = -1;
    this._elRoot.dispatchEvent(new CustomEvent('select.change'));
    this._params.onSelected ? this._params.onSelected(this, null) : null;
    return '';
  }
  _changeValue(option) {
    if (option.classList.contains(CLASS_NAME_SELECTED) || option.classList.contains(CLASS_NAME_DISABLED)) {
      return;
    }
    this._update(option);
    this.hide();
  }
  show() {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
    if(this._isSizing) {
      this._elRootSizing.classList.add(CLASS_NAME_ACTIVE);
    } else {
      this._elRoot.classList.add(CLASS_NAME_ACTIVE);
    }
  }
  hide() {
    if(this._isSizing) {
      this._elRootSizing.classList.remove(CLASS_NAME_ACTIVE);
    } else {
      this._elRoot.classList.remove(CLASS_NAME_ACTIVE);
    }
  }
  toggle() {
    if(this._isSizing) {
      if (this._elRootSizing.classList.contains(CLASS_NAME_ACTIVE)) {
        this.hide();
      } else {
        this.show();
      }
    } else {
      if (this._elRoot.classList.contains(CLASS_NAME_ACTIVE)) {
        this.hide();
      } else {
        this.show();
      }
    }
    
  }
  dispose() {
    this._elRoot.removeEventListener('click', this._onClick);
  }
  get value() {
    return this._elToggle.value;
  }
  set value(value) {
    let isExists = false;
    this._elRoot.querySelectorAll('.custom-select__option').forEach((option) => {
      if (option.dataset['value'] === value) {
        isExists = true;
        return this._update(option);
      }
    });
    if (!isExists) {
      return this._reset();
    }
  }
  get selectedIndex() {
    return this._elToggle.dataset['index'];
  }
  set selectedIndex(index) {
    const option = this._elRoot.querySelector(`.custom-select__option[data-index="${index}"]`);
    if (option) {
      return this._update(option);
    }
    return this._reset();
  }
}

CustomSelect.template = params => {
  const name = params['name'];
  const options = params['options'];
  const targetValue = params['targetValue'];
  let items = [];
  let selectedIndex = -1;
  let selectedValue = '';
  let selectedContent = 'Выберите из списка';
  options.forEach((option, index) => {
    let selectedClass = '';
    if (option[0] === targetValue) {
      selectedClass = ' custom-select__option_selected';
      selectedIndex = index;
      selectedValue = option[0];
      selectedContent = option[1];
    }
    items.push(`<li class="custom-select__option${selectedClass}" data-select="option" data-value="${option[0]}" data-index="${index}">${option[1]}</li>`);
  });
  return `<button type="button" class="custom-select__toggle" name="${name}" value="${selectedValue}" data-select="toggle" data-index="${selectedIndex}">${selectedContent}</button>
  <div class="custom-select__dropdown">
    <ul class="custom-select__options">${items.join('')}</ul>
  </div>`;
};


document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-select')) {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
  }
});