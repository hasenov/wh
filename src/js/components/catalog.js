import { sendForm } from '../services/api.service';
import productCard from '../helpers/productCard';
import enquire from 'enquire.js';
import MicroModal from 'micromodal';
import noUiSlider from 'nouislider';

const isIdenticalArrays = (arr1, arr2) =>
    !arr1.filter(i => !arr2.includes(i)).concat(arr2.filter( i => !arr1.includes(i))).length

const catalogWrapper = document.querySelector('.catalog');
if(catalogWrapper) {

let breakpointMDMatches = false;
enquire.register("screen and (max-width:992px)", {
    match: function() {
        breakpointMDMatches = true;
    },
    unmatch: function() {
        breakpointMDMatches = false;
    },
})

let breakpointSMMatches = false;
enquire.register("screen and (max-width:576px)", {
    match: function() {
        breakpointSMMatches = true;
    },
    unmatch: function() {
        breakpointSMMatches = false;
    },
})

// Range START
const rangePrice = document.getElementById('range_price');
const rangePriceInstance = rangePrice.querySelector('.range__slider');
const rangePriceControlMin = rangePrice.querySelector('.range__control_min');
const rangePriceControlMax = rangePrice.querySelector('.range__control_max');

const startValues = [0, 20000]

noUiSlider.create(rangePriceInstance, {
    start: startValues,
    connect: true,
    step: 1,
    format: {
        to: (v) => parseFloat(v).toFixed(0),
        from: (v) => parseFloat(v).toFixed(0)
    },
    range: {
        'min': startValues[0],
        'max': startValues[1]
    }
});

rangePriceInstance.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];

    if (handle) {
        rangePriceControlMax.value = value;
        rangePriceControlMax.dataset.value = 'До ' + value;
    } else {
        rangePriceControlMin.value = value;
        rangePriceControlMin.dataset.value = 'От ' + value;
    }
});

rangePriceControlMin.addEventListener('change', function () {
    rangePriceInstance.noUiSlider.set([this.value, null]);
});

rangePriceControlMax.addEventListener('change', function () {
    rangePriceInstance.noUiSlider.set([null, this.value]);
});
// Range END

const Catalog = function() {
    const container = document.querySelector('.products-catalog__row');
    const lang = document.getElementById('lang').value;
    const currency = document.getElementById('currency').value;
    let viewModeGlobal = 4;

    const changeViewModeHandler = function(e) {
        const viewMode_1 = document.querySelector('.view-mode__item_1');
        const viewMode_2 = document.querySelector('.view-mode__item_2');
        const viewMode_3 = document.querySelector('.view-mode__item_3');
        const viewMode_4 = document.querySelector('.view-mode__item_4');

        const element = e.target.closest('.view-mode__item');
        if(element) {
            switch (element) {
                case viewMode_1:
                    changeViewMode(1);
                    break;
                case viewMode_2:
                    changeViewMode(2);
                    break;
                case viewMode_3:
                    changeViewMode(3);
                    break;
                case viewMode_4:
                    changeViewMode(4);
                    break;
                default:
                    break;
            }
            
        }
    }

    const changeViewMode = function(mode = 4) {
        viewModeGlobal = mode;

        document.querySelector('.view-mode__item.active')?.classList.remove('active');
        document.querySelector(`.view-mode__item_${mode}`)?.classList.add('active');

        let rowClassname = 'products-catalog__row_' + mode;
        const row = document.querySelector('.products-catalog__row');
        row.className = 'products-catalog__row row';
        row.classList.add(rowClassname);

        let cardClassname = 'card-product_' + mode;
        const cards = document.querySelectorAll('.products-catalog__row .card-product');
        cards.forEach((card) => {
            card.className = 'card-product';
            card.classList.add(cardClassname);
        });
        const viewModeData = {
            pathname: location.pathname,
            mode
        }
        sessionStorage.setItem('view_mode', JSON.stringify(viewModeData));
    }

    const banner = function(item) {
        return `
            <a href="article.html" class="products-catalog__banner">
                <img src="assets/img/content/promo-catalog.jpg" alt="alt" class="img-responsive">
            </a>
        `
    } 

    const printElements = (elements) => {
        if (elements.length === 0) {
            return '<div style="width: 100%; padding: 40px 0; text-align: center;">не найдено</div>'
        }
        return elements.map((item, i) => {
            if(breakpointSMMatches) {
                if(viewModeGlobal === 2 && i === 4) {
                    return banner()
                } else if(viewModeGlobal === 1 && i === 2) {
                    return banner()
                } else {
                    return productCard(item, lang, currency).html()
                }
            } else {
                return productCard(item, lang, currency).html()
            }
        }).join('')
    }

    return {
        showPreloader() {
            container.style.opacity = 0.55
            container.style.pointerEvents = 'none'
            return this
        },
        hidePreloader() {
            container.style.opacity = 1
            container.style.pointerEvents = 'auto'
            return this
        },
        update(elements, append = false, wl_update = true) {
            if (append) {
                container.insertAdjacentHTML('beforeend', printElements(elements))
            } else {
                container.innerHTML = printElements(elements)
            }
            // if (typeof wishlist !== 'undefined' && wl_update) wishlist.updateList()
            return this
        },
        init() {
            if (sessionStorage.getItem('view_mode')) {
                const viewModeData = JSON.parse(sessionStorage.getItem('view_mode'))
                if (viewModeData['pathname'] == location.pathname) {
                    changeViewMode(viewModeData.mode)
                } else {
                    sessionStorage.removeItem('view_mode')
                }
            }

            document.querySelector('.view-mode__items').addEventListener('click', changeViewModeHandler);
            enquire
                .register("screen and (max-width:1200px)", {
                    match: function() {
                        changeViewMode(3);
                    },
                    unmatch: function() {
                        changeViewMode(4);
                    },
                })
                .register("screen and (max-width:768px)", {
                    match: function() {
                        changeViewMode(2);
                    },
                    unmatch: function() {
                        changeViewMode(3);
                    },
                })
            return this
        }
    }
}

const FilterControl = function(el) {
    const element = el.querySelector('.item-filter__mm-modal')
    const trigger = el.querySelector('.filter-btn')
    // const valuesContainer = trigger.querySelector('.filter-btn__values')
    const id = element.id
    const inputs = [...element.querySelectorAll('input')]

    let state = 'close'

    const defaultValues = inputs.map(input => input.value)
    const defaultChecked = inputs.filter(input => input.checked)

    let currentValues = inputs.map(input => input.value)
    let currentChacked = inputs.filter(input => input.checked)

    // const printValue = () => {
    //     let items = 0

    //     let text = inputs.filter(input => {
    //         if (input.type === 'checkbox' || input.type === 'radio') {
    //             return input.checked
    //         }
    //         return true
    //     }).map(input => {

    //         items++

    //         if (input.type === 'checkbox' || input.type === 'radio') {
    //             return input.dataset.value || input.value
    //         }

    //         return input.value
    //     }).join(valuesContainer.dataset.separator || ', ')

    //     if (valuesContainer.dataset.suffix) text += valuesContainer.dataset.suffix

    //     valuesContainer.innerText = text

    //     return items > 0
    // }

    return {
        get id() {
            return id
        },
        get element() {
            return element
        },
        get trigger() {
            return trigger
        },
        get state () {
            return state
        },
        get changed() {
            return !isIdenticalArrays(defaultValues, currentValues) || !isIdenticalArrays(defaultChecked, currentChacked)
        },
        get value() {
            return currentValues
        },
        show() {
            this.element.removeAttribute('hidden')
            trigger.setAttribute('aria-expanded', 'true')
            state = 'open'
            return this
        },
        hide() {
            this.element.setAttribute('hidden', true)
            trigger.setAttribute('aria-expanded', 'false')
            state = 'close'
            return this
        },
        toggle() {
            state === 'open' ? this.hide() : this.show()
            return this
        },
        update(setClass) {
            currentValues = inputs.map(input => input.value)
            currentChacked = inputs.filter(input => input.checked)
            // if(breakpointLgMatches) {
            //     const hasValues = printValue()
            //     if (setClass && hasValues) this.trigger.classList.add('item-filter_updated')
            //     if (!hasValues) this.trigger.classList.remove('item-filter_updated')
            // }
            return this
        },
        reset() {
            inputs.forEach((input, idx) => {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    if (defaultChecked.includes(input)) {
                        input.checked = true
                    } else {
                        input.checked = false
                    }
                } else if(input.type === 'number') {
                    return
                } else {
                    input.value = defaultValues[idx]
                }
            })
            this.trigger.classList.remove('item-filter_updated')
            this.update(false)
            return this
        },
        resetOne(id) {
            const input = inputs.find((input) => {
                return id == input.id
            })
            let index;
            inputs.forEach((input, idx) => {
                if(input.id == id) {
                    index = idx;
                }
            })

            if (input.type === 'radio' || input.type === 'checkbox') {
                if (defaultChecked.includes(input)) {
                    input.checked = true
                } else {
                    input.checked = false
                }
            } else if(input.type === 'number') {
                if(id === 'filterFrom') {
                    rangePriceInstance.noUiSlider.set([startValues[0], null]);
                } else if(id === 'filterTo') {
                    rangePriceInstance.noUiSlider.set([null, startValues[1]]);
                }
            } else {
                input.value = defaultValues[index]
            }
            this.update(false)
            return this
        },
        checked() {
            return currentChacked;
        },
    }
}

const Filter = function() {
    const filterForm = document.querySelector('.filter');
    const controls = [...filterForm.querySelectorAll('.filter__item')].map(FilterControl)
    const catalog = Catalog().init();

    let checkedParams = [];

    function toggleFilterPopup(wrapper) {
        if (wrapper.classList.contains('active')) {
            closeFilterPopup(wrapper);
        } else {
            openFilterPopup(wrapper)
        }
    }

    function openFilterPopup(wrapper) {
        const active = document.querySelector('.item-filter.active')
        if(active) {
            active.classList.remove('active');
            MicroModal.close(active.querySelector('.item-filter__mm-modal').id)
        }
        wrapper.classList.add("active");
    }

    function closeFilterPopup(wrapper) {
        wrapper.classList.remove("active");
        MicroModal.close(wrapper.querySelector('.item-filter__mm-modal').id)
    }

    const clickHandler = function(e) {
        const filterBtn = e.target.closest('.filter-btn');
        if(filterBtn) {
            toggleFilterPopup(filterBtn.closest('.item-filter'));
        }

        const param = e.target.closest('.selected-params__item');
        if(param) {
            const input = document.getElementById(param.dataset.id);

            // В моб. версии у всех фильтров есть родилеть с классом "item-filter__mm-modal", кроме первого фильтра сортировки. Поэтому находим нужного родителя вручную.
            const element = input.closest('.item-filter__mm-modal') ? input.closest('.item-filter__mm-modal') : document.getElementById('modal-sort');

            const filterControl = checkedParams.find((item) => {
                return element.id == item.filterControl.id
            });

            filterControl.filterControl.resetOne(input.id);

            document.querySelectorAll(`[data-id=${param.dataset.id}]`).forEach((param) => {
                param.remove();
            })

            fireFormRequest();
            setCheckedParams();
            renderCheckedParams(checkedParams)
        }

        const modalPopupBtn = e.target.closest('.modal-popup__btn');
        if(modalPopupBtn) {
            MicroModal.close(modalPopupBtn.closest('.mm-modal').id);
        }

        const resetCats = e.target.closest('.reset-categories');
        if(resetCats) {
            filterForm.dispatchEvent(new Event('reset'));
        }
    }

    window.onclick = function(event) {
        if (!event.target.closest('.filter-btn') && !event.target.closest('.item-filter__mm-modal')) {
            var popups = document.getElementsByClassName("item-filter");
            var i;
            for (i = 0; i < popups.length; i++) {
                var activePopup = popups[i].querySelector('.item-filter__mm-modal');
                if (activePopup.classList.contains('is-open')) {
                    MicroModal.close(activePopup.id)
                    popups[i].classList.remove('active')
                }
            }
        }
    }

    // Selected parameters list
    const renderCheckedParams = function(params) {
        const ranges = [...document.querySelectorAll('.range__control')].filter((item, i) => {
            return parseInt(item.value) !== startValues[i]
        })

        const containers = document.querySelectorAll('.selected-params__list');
        containers.forEach((container) => {
            container.innerHTML = '';
            
            let fragment = ''

            const checked = params.map((param) => {
                return param.checked
            })

            const flatArrChecked = [].concat.apply([], checked)
            const flatArrRanges = [].concat.apply([], ranges)

            const flatArr = [...flatArrChecked, ...flatArrRanges]

            if(!flatArr.length) {
                document.querySelectorAll('.selected-params').forEach((el) => el.classList.remove('active'))
            } else {
                document.querySelectorAll('.selected-params').forEach((el) => el.classList.add('active'))
            }

            flatArr.forEach(param => {
                const template = paramTemplate(param)
                fragment += template;
            });

            container.insertAdjacentHTML('afterbegin', fragment);
        })
    }

    function paramTemplate(param) {
        const title = param.dataset.value || param.value;

        return `
            <li class="selected-params__item tag-btn" data-id="${param.id}">
                ${title}
                <svg class="tag-btn__icon">
                    <use href="assets/img/svg-sprite/sprite.svg#close"></use>
                </svg>
            </li>
        `
    }

    const clearCheckedParams = function() {
        const containers = document.querySelectorAll('.selected-params__list');
        containers.forEach((container) => {
            container.innerHTML = '';
        });
    }

    const setCheckedParams = function() {
        checkedParams = controls.map((control) => { 
            return {
                checked: control.checked(),
                filterControl: control
            }
        })
    }

    const changeHandler = function(e) {
        controls.forEach(control => {
            // if (!control.element.contains(e.target)) return
            control.update(true)
        })

        if(breakpointMDMatches && e && e.target.name === 'sort_by') {
            fireFormRequest();
        }
    }

    function fireFormRequest() {
        filterForm.dispatchEvent(new Event('submit', { cancelable: true }));
    }

    const resetHandler = function(e) {
        controls.forEach(control => control.reset())
        // rangePriceInstance.noUiSlider.reset();

        rangePriceInstance.noUiSlider.set([startValues[0], null]);
        rangePriceInstance.noUiSlider.set([null, startValues[1]]);
        
        fireFormRequest()
        sessionStorage.removeItem('filter_data')
        clearCheckedParams()
        setCheckedParams();
        renderCheckedParams(checkedParams)
    }

    const submitHandler = function(e) {
        e.preventDefault();
        catalog.showPreloader();

        // const urlSearchParams = new URLSearchParams(window.location.search);
        // const params = Object.fromEntries(urlSearchParams.entries());

        // console.log(urlSearchParams)

        // sendForm('GET', this.getAttribute('action'))
        //     .then((res) => {
        //         console.log(res)
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })

        const data = new FormData(filterForm)
        sendForm('POST', filterForm.getAttribute('action'), data)
            .then((res) => {
                if (!Array.isArray(res)) {
                    console.error(res, 'is not an array')
                }
                const filter_data = {
                    pathname: location.pathname,
                    form_data: Array.from(new FormData(filterForm).entries()).reduce((acc, el) => {
                        if (el[1]) {
                            return {...acc, [el[0]]: el[1]}
                        } else {
                            return acc;
                        }
                    }, {}),
                    elements: res
                }
                sessionStorage.setItem('filter_data', JSON.stringify(filter_data))
                catalog.update(res).hidePreloader();

                document.querySelector('.modal-filter__count').textContent = ': ' + res.length;

                setCheckedParams();
                renderCheckedParams(checkedParams)
            })
            .catch((err) => {
            });
    }

    if (sessionStorage.getItem('filter_data')) {
        const data = JSON.parse(sessionStorage.getItem('filter_data'))
        if (data['pathname'] == location.pathname) {
            Object.keys(data['form_data']).forEach(el => {
                const name = el
                const value = data['form_data'][el]
                const inputs = filterForm.querySelectorAll(`input[name="${name}"]`)

                inputs.forEach(input => {
                    const control_id = input.closest('.item-filter__mm-modal').id
                    const control = controls.filter(el => el.id === control_id)[0]
                    if ((input.type === 'radio' || input.type === 'checkbox')) {
                        if (input.value == value) {
                            input.checked = true
                        }
                        control.update(true)
                    } else if(input.type === 'number') {
                        if(value && (input.id === 'filterFrom')) {
                            rangePriceInstance.noUiSlider.set([value, null]);
                        } else if(value && (input.id === 'filterTo')) {
                            rangePriceInstance.noUiSlider.set([null, value]);
                        }
                        control.update(true)
                    } else {
                        if (value) {
                            input.value = value
                            control.update(true)
                        }
                    }
                })
            })
            catalog.update(data['elements'], false, false).hidePreloader()
            document.querySelector('.modal-filter__count').textContent = ': ' + data['elements'].length;
            setCheckedParams()
            renderCheckedParams(checkedParams)
        } else {
            sessionStorage.removeItem('filter_data')
        }
    }

    renderCheckedParams(checkedParams)

    return {
        init() {
            filterForm.addEventListener('submit', submitHandler)
            document.documentElement.addEventListener('click', clickHandler)
            filterForm.addEventListener('change', changeHandler, true)
            document.querySelectorAll('.reset-filter').forEach((btn) => {
                btn.addEventListener('click', resetHandler)
            })

            rangePriceInstance.noUiSlider.on('set', function (values, handle) {
                changeHandler()
            });
            return this
        },
        destroy() {
            return this
        }
    }
}

const filter = Filter().init()

}
