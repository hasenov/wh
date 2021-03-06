import { sendForm } from "../services/api.service";
import { formatNumber } from "../helpers/formatNumber";
import { ac } from './autocomplete';
import SlimSelect from 'slim-select';
import { show, hide } from 'slidetoggle'
import floatLabel from "./floatLabel";
import { initFormValidation, isFormValid, showInputError, removeInputError } from '../helpers/validate';
import MicroModal from "micromodal";

export default function initCart() {
    
const cartForm = document.querySelector('.cart__form');
if(cartForm) {

const formPromocode = document.forms['formPromocode'];
const promocodeInput = document.getElementById('promocode');
const promocodeCheckbox = document.querySelector('.promo-code__checkbox');

let fullPrice = document.getElementById('fullPrice');
let fullPrices = document.querySelectorAll('.js-full-price');
let totalPrice = document.getElementById('totalPrice');
let priceWithDiscount = document.getElementById('priceWithDiscount');
let deliveryPrice = document.getElementById('deliveryPrice');
let pricePlusDelivery = document.getElementById('pricePlusDelivery');

let priceDiscountWrapper = document.querySelector('.totals-checkout__item_discount');
let priceDeliveryWrapper = document.querySelector('.totals-checkout__item_delivery');
let priceTotalWrapper = document.querySelector('.totals-checkout__item_total');

function onFormPromocodeSubmit() {
    const formData = new FormData(formPromocode);

    sendForm('POST', formPromocode.getAttribute('action'), formData)
        .then((result) => {
            if(result.code == 'not_found') {
                showInputError(promocodeInput.parentElement, 'Промокод не верный или не действительный')
            } else if(result.code == 'expired') {
                showInputError(promocodeInput.parentElement, 'Промокод уже использован')
            } else {
                console.log(result)
    
                priceTotalWrapper.style.display = 'flex';
                priceDiscountWrapper.style.display = 'flex';
                priceWithDiscount.textContent = formatNumber(totalPrice.value - result['all_total_promo']);
                fullPrices.forEach((el) => {
                    el.textContent = formatNumber(result['all_total_promo'])
                })
                document.getElementById('totalPriceWithPromocode').value = result['all_total_promo'];
                document.getElementById('promocodeHidden').value = result['promo_cod'];
                if (deliveryPrice.value != 0) {
                    pricePlusDelivery.textContent = formatNumber(delivery.value);
                    priceDeliveryWrapper.style.display = 'flex';

                    fullPrices.forEach((el) => {
                        el.textContent = formatNumber(+result['all_total_promo'] + +delivery.value)
                    })
                }

                promocodeCheckbox.checked = false;
            }
        })
}

function showInputError(el, msg) {
    const template = inputErrorTemplate(msg);
    el.classList.add('is-invalid');
    formPromocode.insertAdjacentHTML('beforeend', template);
}

function removeInputError(el) {
    const err = formPromocode.querySelector('.promo-code__feedback-form');
    if (!err) return;

    el.classList.remove('is-invalid');
    formPromocode.removeChild(err);
}

function inputErrorTemplate(msg) {
    return `
        <div class="promo-code__feedback-form feedback-form feedback-form_danger">${msg}</div>
    `;
}

if(formPromocode) {
    formPromocode.addEventListener('submit', (e) => {
        e.preventDefault();
        onFormPromocodeSubmit();
    });

    promocodeInput.addEventListener('focus', () => removeInputError(promocodeInput));
}

initFormValidation(cartForm, true);

// function checkCartFormValidation() {
//     const submitBtn = document.querySelector('.proceed-to-checkout__btn');

//     if(!isFormValid(cartForm, false) || cartForm.checkValidity() === false) {
//         submitBtn.disabled = true;
//     } else {
//         submitBtn.disabled = false;
//     }
// }

// checkCartFormValidation();

// cartForm.addEventListener('change', function() {
//     checkCartFormValidation();
// });

cartForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const modalCartError = document.getElementById('modal-cart-error');
    const modalCartErrorTitle = modalCartError.querySelector('.message-auth__title');
    const modalCartErrorText = modalCartError.querySelector('.message-auth__text-wrap');
    const deliveryChecked = document.querySelector('input[name="delivery_id"]:checked');
    const paymentChecked = document.querySelector('input[name="payment_id"]:checked');

    if(!deliveryChecked) {
        MicroModal.show('modal-cart-error', {
            awaitCloseAnimation: true,
            disableScroll: true,
        });
        modalCartErrorTitle.textContent = 'Вы не выбрали способ доставки';
        modalCartErrorText.textContent = 'Вернитесь в корзину и выберите удобный для вас способ';
        return;
    }

    if(!paymentChecked) {
        MicroModal.show('modal-cart-error', {
            awaitCloseAnimation: true,
            disableScroll: true,
        });
        modalCartErrorTitle.textContent = 'Вы не выбрали способ оплаты';
        modalCartErrorText.textContent = 'Вернитесь в корзину и выберите удобный для вас способ';
        return;
    }

    if(!isFormValid(cartForm)) {
        const element = cartForm.querySelector('.control-field.is-invalid');
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2);
        window.scrollTo(0, middle);
        return;
    };

    cartForm.submit();
})

document.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.orders-cart__item .item-order__delete-btn')
    if(deleteBtn) {
        const itemOrder = deleteBtn.closest('.item-order');
        const formData = new FormData();
        let fullMinicartPrice = document.querySelector('.totals-minicart__value span');

        var id = itemOrder.dataset.id;
        var hiddenPromocode = document.getElementById('promocodeHidden');

        formData.append('id', id);
        formData.append('promocode', hiddenPromocode.value ? hiddenPromocode.value : 0);

        sendForm('POST', '/cart/deleteitem', formData)
            .then((result) => {
                if (result.count_product == 0) {
                    location.reload();
                }
        
                document.querySelectorAll(`.item-order[data-id="${id}"]`).forEach((el) => {
                    el.remove();
                })

                fullMinicartPrice.textContent = formatNumber(result.total);

                fullPrice.textContent = formatNumber(result.total);

                fullPrices.forEach((el) => {
                    el.textContent = formatNumber(result['all_total_promo'] !== "" ? result['all_total_promo'] : result.total);
                });
                totalPrice.value = result.total;
                document.getElementById('totalPriceWithPromocode').value = result['all_total_promo'];
                priceWithDiscount.textContent = formatNumber(result.total - result['all_total_promo']);

                if (deliveryPrice.value != 0) {
                    pricePlusDelivery.textContent = formatNumber(delivery.value);
                    priceDeliveryWrapper.style.display = 'flex';

                    fullPrices.forEach((el) => {
                        el.textContent = formatNumber(result['all_total_promo'] !== "" ? +result['all_total_promo'] + +delivery.value : +result.total + +delivery.value)
                    })
                }
            })
            .catch((err) => {
            })
    }
})

if(document.getElementById('hasPromocode') && document.getElementById('hasPromocode').value) {
    priceTotalWrapper.style.display = 'flex';
}

document.querySelectorAll('.js-format-number').forEach((el) => {
    if (el.innerText == '') return;
    el.innerText = formatNumber(+el.innerText.trim());
})

var suggestionsUrl = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
var suggestionsToken = "b99f4658fa2ae31624302592c90df0daeaaec6d4";

document.querySelectorAll('.js-autocomplete-address').forEach((el) => {
    ac.attach({
        target: el,
        data: suggestionsUrl,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + suggestionsToken
        },
        post: {
            count: 5,
            restrict_value: false,
            locations: [
                {
                    country: "*"
                }
            ]
        },
    })
});

let pickupCityInfo = [];

function handleSelectAjax(search, callback) {
    if (search.length < 3) {
        callback('Пожалуйста, введите хотя бы 3 символа')
        return
    }

    sendForm('GET', '/cart/addCity?' + new URLSearchParams({
        q: search
    }))
    .then(function(response) {
        let data = []
        for (let i = 0; i < response.length; i++) {
            data.push({
                text: response[i].abbreviation + '. ' + response[i].cityName + ', ' + response[i].regionName,
                value: response[i].cityCode,
            })
            pickupCityInfo.push({
                text: response[i].abbreviation + '. ' + response[i].cityName + ', ' + response[i].regionName,
                id: response[i].cityCode,
                city: response[i].cityId,
                address: response[i].cityName,
            })
        }
        callback(data)
    })
    .catch(function(error) {
        callback(false)
    })
}

const pickupCity = new SlimSelect({
    select: '#pickupCity',
    searchPlaceholder: 'Поиск',
    searchText: 'Не найдено',
    placeholder: document.getElementById('pickupCity').dataset.placeholder || 'Введите название города',
    ajax: function (search, callback) {
        handleSelectAjax(search, callback);
    },
    onChange: (info, ss, s) => {
        const selected = pickupCityInfo.find((item) => {
            return item.id === info.value;
        })
        document.getElementById('cityId').value = selected.city;
        document.getElementById('cityCode').value = selected.id;
        document.getElementById('cityNameRegion').value = selected.text;
        document.getElementById('deliveryMethod').value = 'none';
        addPoints(postalDir, info.value);
        document.getElementById('pickupCity').closest('.option-cart__control-field').classList.remove('is-invalid');
    }
})

const courierCity = new SlimSelect({
    select: '#courierCity',
    searchPlaceholder: 'Поиск',
    searchText: 'Не найдено',
    placeholder: document.getElementById('courierCity').dataset.placeholder || 'Введите название города',
    ajax: function (search, callback) {
        handleSelectAjax(search, callback);
    },
    onChange: (info) => {
        const selected = pickupCityInfo.find((item) => {
            return item.id === info.value;
        })
        document.getElementById('cityId').value = selected.city;
        document.getElementById('cityCode').value = selected.id;
        document.getElementById('cityNameRegion').value = selected.text;
        document.getElementById('deliveryMethod').value = 'none';
        addPoints(postalDir, info.value);
        document.getElementById('courierCity').closest('.option-cart__control-field').classList.remove('is-invalid');
    }
})

const postalDir = new SlimSelect({
    select: '#postalDir',
    searchPlaceholder: 'Поиск',
    searchText: 'Не найдено',
    placeholder: document.getElementById('postalDir').dataset.placeholder || 'Выберите пункт выдачи',
    onChange: () => {
        document.getElementById('postalDir').closest('.option-cart__control-field').classList.remove('is-invalid');
    }
})

const devCosts = function() {
    let id = document.getElementById('cityId').value;
    let delMethod = document.getElementById('deliveryMethod').value;

    let formData = new FormData();
    formData.append('id', id)
    formData.append('sposob', delMethod)
    formData.append('all_total_promo', document.getElementById('totalPriceWithPromocode').value)
    
    sendForm('POST', '/cart/devCosts', formData).then((res) => {
        console.log(res)
        let cost = parseInt(res.cost, 10);
        let total = parseInt(res.total, 10);
        let days = parseInt(res.days, 10);
        let daysTotal = days + 2;
        deliveryPrice.value = res.cost;
        document.getElementById("cityDaysMail").value = daysTotal;
        document.querySelector('.totals-checkout__item_delivery').style.display = 'flex';
        document.getElementById("pricePlusDelivery").textContent = formatNumber(cost);
        priceTotalWrapper.style.display = 'flex';
        fullPrices.forEach((el) => {
            el.textContent = formatNumber(total + cost)
        })
    })

    return;
}

const addPoints = function (container, value) {
    var formData = new FormData();
    formData.append('code', value);

    container.slim.container.closest('.control-field').insertAdjacentHTML('beforeend', '<div class="control-field__spinner swiper-lazy-preloader"></div>')
    container.slim.container.classList.add('hidden')
    
    sendForm('POST', '/cart/listPoints', formData).then((res) => {
        const placeholderArr = [{text: '', placeholder: true}]
        const newArr = [...placeholderArr, ...res.map((item) => {
            return {
                text: item.content,
                value: item.value
            }
        })]
        container.setData(newArr)

        const preloader = container.slim.container.closest('.control-field').querySelector('.control-field__spinner')
        container.slim.container.closest('.control-field').removeChild(preloader)
        container.slim.container.classList.remove('hidden')

        deliveryPrice.value = '';
        document.getElementById("cityDaysMail").value = '';
        document.getElementById("pricePlusDelivery").textContent = '';
        document.getElementById("pricePlusDelivery").closest('.totals-checkout__item').style.display = 'none';

        devCosts();

    }).catch((err) => {

    })

    return;
}

const optionCartInputs = document.querySelectorAll('.option-cart_delivery .option-cart__input');
optionCartInputs.forEach((el) => {
    el.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            let active = document.querySelector('.option-cart_delivery.active');
            if(active) {
                let activeContent = active.querySelector('.option-cart__controls')
                activeContent.querySelectorAll('.control-field__control').forEach((item) => {
                    item.value = ''
                })
                hide(activeContent, {
                    transitionFunction: 'ease',
                    onAnimationEnd: () => {
                        active.classList.remove('active');
                    },
                })
                floatLabel.init()
                const activeControls = active.querySelectorAll('.option-cart__control-field .control, .option-cart__control-field select')
                activeControls.forEach((control) => {
                    control.required = false;
                })
            }
            const parent = el.closest('.option-cart');
            const content = parent.querySelector('.option-cart__controls');
            show(content, {
                transitionFunction: 'ease',
                onAnimationEnd: () => {
                    parent.classList.add('active');
                },
            })

            const controls = parent.querySelectorAll('.option-cart__control-field .control, .option-cart__control-field select')

            controls.forEach((control) => {
                control.required = true;
            })
        }
    
        const idx = el.value;
    
        const deliveryMethods = [undefined, 'none', 'home'];
    
        document.getElementById('deliveryMethod').value = deliveryMethods[idx - 1] ? deliveryMethods[idx - 1] : '';

        document.getElementById("cityDaysMail").value = '';
        document.getElementById("pricePlusDelivery").textContent = '';
        document.getElementById("pricePlusDelivery").closest('.totals-checkout__item').style.display = 'none';
    
        if (document.getElementById('pickupCity').value !== '' || document.getElementById('courierCity').value !== '') {
            devCosts();
        }
    })
});

(function () {
    var formFields = [
        {
            id: 'clientLastname',
            ajaxUrl: '/cart/form_surname',
            key: 'surname'
        },
        {
            id: 'clientName',
            ajaxUrl: '/cart/form_first_name',
            key: 'first_name'
        },
        {
            id: 'clientEmail',
            ajaxUrl: '/cart/form_email',
            key: 'email'
        },
        {
            id: 'clientPhone',
            ajaxUrl: '/cart/form_phone',
            key: 'phone'
        }
    ];
    
    formFields.forEach(function(item) {
        var oldVal, newVal;
        var $field = document.getElementById(item.id);
    
        if (!$field) return;
    
        $field.addEventListener('keydown', function(e) {
            if (e.which == 13) return false;
        });
    
        $field.addEventListener('focus', function() {
            oldVal = this.value;
        })
    
        $field.addEventListener('blur', function() {
            newVal = $field.value;
    
            if (newVal == oldVal) return;

            const data = new FormData();
            data.append(item.key, newVal);
    
            sendForm('POST', item.ajaxUrl, data).then((res) => {
                console.log(res)
            }).catch((err) => {

            })
        })
    });
})();

}

}

