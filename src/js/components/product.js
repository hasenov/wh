import MicroModal from "micromodal";
import CustomSelect from "./customSelect";
import updateMiniCart from "./miniCart";
import { sendForm } from "../services/api.service";
import { parsePrice } from '../helpers/parsePrice';
import { formatNumber } from "../helpers/formatNumber";
import { initFormValidation, isFormValid } from '../helpers/validate';
import enquire from 'enquire.js';

const Product = function () {
    const currentPriceEl = document.getElementById('productPrice')
    if (!currentPriceEl) return

    const fullPriceEl = document.getElementById('oldPrice')
    const fullPriceContainer = document.getElementById('oldPriceContainer')
    const messageEl = document.querySelector('.output-sizing-product__message')

    const currentPrice = parsePrice(currentPriceEl.innerText)
    const fullPrice = fullPriceEl ? parsePrice(fullPriceEl.innerText) : currentPrice
    const individualSizeControl = document.getElementById('sizeIndividual')
    const individulaSizingPrice = individualSizeControl ? parsePrice(individualSizeControl.dataset.priceIncrement) : 0
    const message = `<span>Цена увеличена на ${formatNumber(individulaSizingPrice)}р., за индивидуальный пошив</span>`
    const message2 = `<span class="sizing-select__status">Последний!</span>`
    let optionCheked = false

    let md = false;

    const calculateIndividualSizingPrice = function() {
        messageEl.innerHTML = message
        return {
            updatePagePrices(optionCheked) {
                const updatedPrice = optionCheked ? (fullPrice + individulaSizingPrice) : currentPrice
                currentPriceEl.innerText = formatNumber(updatedPrice)
                return this
            },
            showMessage() {
                messageEl.style.display = 'inline'
                fullPriceContainer && (fullPriceContainer.style.display = 'none')
                return this;
            },
            hideMessage() {
                messageEl.style.display = 'none'
                fullPriceContainer && (fullPriceContainer.style.display = 'inline-block')
                return this
            }
        }
    }
    
    const sizingSelect = document.querySelector('.sizing-select');
    if(sizingSelect) {
        const indSizingPrice = calculateIndividualSizingPrice()

        const select = new CustomSelect('.sizing-select', {
            isSizingSelect: true,
            onSelected(select, option) {
                const checked = individualSizeControl && select.value === document.getElementById('sizeIndividual').dataset['value']
                indSizingPrice.updatePagePrices(checked)[checked ? 'showMessage' : 'hideMessage']()

                const values = [...option.querySelectorAll('.sizing-select__value')].map((value) => value.textContent);

                const addedToCartSizes = document.getElementById('addedToCartSizes');

                addedToCartSizes.innerHTML = '';

                values.forEach((value) => {
                    addedToCartSizes.innerHTML += `<li>${value}</li>`
                })

                if(md) {
                    MicroModal.close('modal-size-select')
                }
            }
        }, true);

        const showSizeModal = function() {
            select.show()
            MicroModal.show('modal-size-select', {
                awaitCloseAnimation: true,
                disableFocus: true,
                disableScroll: true,
            })

        }

        const sizeDropdown = document.querySelector('.sizing-select .custom-select__dropdown');
        const modalBody = document.getElementById('modal-size-select').querySelector('.body-modal__container');
        const sizeSelect = document.querySelector('.sizing-select');
        if(sizeDropdown && modalBody && sizeSelect) {
            enquire.register("screen and (max-width:992px)", {
                match: function() {
                    md = true;

                    sizeSelect.addEventListener('click', showSizeModal);

                    modalBody.appendChild(sizeDropdown);
                },
                unmatch: function() {
                    md = false;

                    sizeSelect.removeEventListener('click', showSizeModal);
                    
                    sizeSelect.appendChild(sizeDropdown);
                },
            })
        }
    }

    document.querySelectorAll('.custom-select__option[data-balance="1"]').forEach((el) => {
        el.insertAdjacentHTML('beforeend', message2)
    })

    const microModalOptions = {
        awaitCloseAnimation: true,
        disableFocus: true,
        disableScroll: true,
    }

    const formSizesXS = document.forms['formSizesXS'];
    const formSizesS = document.forms['formSizesS'];
    const formSizesM = document.forms['formSizesM'];
    const formSizesL = document.forms['formSizesL'];

    const formsSizesArr = [formSizesXS, formSizesS, formSizesM, formSizesL];

    formsSizesArr.forEach((form) => {
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                onFormSizeSubmit(form);
            });

            initFormValidation(form, true);
        }
    })

    function onFormSizeSubmit(form) {
        if(!isFormValid(form)) return;

        const formData = new FormData(form);
        const modalId = form.closest('.mm-modal').id;
        sendForm('POST', '/main/subscriptionSize', formData).then((res) => {
            MicroModal.close(modalId);
            MicroModal.show('modal-sizes-success', microModalOptions);
            form.reset();
        });
    }

    const formProduct = document.forms['formProduct'];
    formProduct.addEventListener('submit', function(e) {
        e.preventDefault();
        onFormProductSubmit();
    });

    function onFormProductSubmit() {
        const size = formProduct.querySelector('input[name="size"]').value

        if (!size) {
            MicroModal.show('modal-error-size', microModalOptions);
            return;
        }

        MicroModal.show('modal-preloader', microModalOptions);

        const productId = formProduct.querySelector('.info-product__add-to-cart').dataset.id

        const formData = new FormData()
        formData.append('id', productId)
        formData.append('qty', 1)
        formData.append('size', size)

        sendForm('POST', formProduct.getAttribute('action'), formData)
            .then((result) => {
                MicroModal.close('modal-preloader');
                MicroModal.show('modal-added-to-cart', microModalOptions);
                updateMiniCart();
                
                if (typeof sendCartToTrackers !== 'undefined' && typeof sendCartToTrackers === 'function') {
                    sendCartToTrackers()
                }
            })
            .catch((err) => {
                MicroModal.close('modal-preloader');
            })
    }

    const formReview = document.forms['formReview'];
    formReview.addEventListener('submit', function(e) {
        e.preventDefault();

        if(!isFormValid(formReview)) return;

        const formData = new FormData(formReview)
        sendForm('POST', this.getAttribute('action'), formData).then(rsp => {
            formReview.reset()
            MicroModal.close('modal-review')
            MicroModal.show('modal-review-success', microModalOptions)
        })
    });
    initFormValidation(formReview, true);

    const formDiscount = document.forms['formDiscount'];
    if(formDiscount) {
        formDiscount.addEventListener('submit', (e) => {
            e.preventDefault();

            if(!isFormValid(formDiscount)) return;
        
            const formData = new FormData(formDiscount);
            const modalId = formDiscount.closest('.mm-modal').id;
            sendForm('POST', '/main/addOrderPromocode', formData).then((res) => {
                MicroModal.close(modalId);
                MicroModal.show('modal-discount-success', microModalOptions);
                this.reset();
            });
        })
        initFormValidation(formDiscount, true);
    }
}

export default function initProduct() {
    Product()
}