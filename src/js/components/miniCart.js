import { sendForm } from '../services/api.service'
import { formatNumber } from '../helpers/formatNumber'
import { resizeQuantityInputs } from '../app'

const container = document.querySelector('.box-minicart__orders');
const minicartBtn = document.querySelector('.minicart');
let fullPrice = document.querySelector('.totals-minicart__value span');

export default function updateMiniCart() {
    sendForm('GET', '/main/cartMini')
        .then((response) => {
            container.innerHTML = ''
            response.products.forEach((item) => {
                container.innerHTML += template(
                    item,
                    document.getElementById('lang').value || 'rus',
                    document.getElementById('currency').value || 'Руб.',
                )
            })
            if(response.products.length) {
                minicartBtn.classList.add('action-header_status');
                fullPrice.textContent = formatNumber(response.total);
                resizeQuantityInputs();
            } else {
                minicartBtn.classList.remove('action-header_status');
            }
        })
}

function template(product, lang, currency) {
    const title = product['title_' + lang]

    const printPrices = product => {
        if (product.price == 0 || product.available !== 'available') {
            return '<div class="item-order__price">Нет в наличии</div>';
        } else if (product.discount > 0 && product.price !== 0) {
            const actualPrice = product.price;
            return `
                <ins class="item-order__price item-order__price_new">${formatNumber(actualPrice)} ${currency}</ins>
                <del class="item-order__old-price crossed">${formatNumber(product.old_price)} ${currency}</del>
            `;
        } else {
            return `
                <div class="item-order__price">${formatNumber(product.price)} ${currency}</div>
            `;
        }
    }

    return `
        <div class="box-minicart__order item-order" data-id="${product.id}_${product.size}">
            <a href="/catalog/${product.url}" class="item-order__img-wrap dummy-bg">
                <img src="/images/products/thumb/${product.img}" alt="${title}" class="item-order__img img-responsive">
            </a>
            <div class="item-order__content">
                <h4 class="item-order__title color-gradient-accent"><a href="/catalog/${product.url}">${title}</a></h4>
                ${product.size_title ? `
                    <div class="item-order__info-wrap">
                        <span class="item-order__info">Размер: ${product.size_title}</span>
                    </div>
                ` : ''}
                
                <div class="item-order__price-wrap">
                    ${printPrices(product)}
                </div>
                <div class="item-order__actions">
                    <div class="item-order__quantity quantity">
                        <button class="quantity__btn quantity__btn_minus" type="button">
                            <span class="quantity__plus plus active"></span>
                        </button>
                        <div class="quantity__count">
                            <input type="number" class="quantity__control" min="1" value="${product.count}">
                            <span class="quantity__text">шт</span>
                        </div>
                        <button class="quantity__btn quantity__btn_plus" type="button">
                            <span class="quantity__plus plus"></span>
                        </button>
                    </div>
                    <button class="item-order__delete-btn delete-btn" type="button">
                        <svg class="delete-btn__icon">
                            <use href="assets/img/svg-sprite/sprite.svg#trash"></use>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `
}