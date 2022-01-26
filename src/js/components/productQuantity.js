import { sendForm } from "../services/api.service"
import { formatNumber } from "../helpers/formatNumber"

const cartForm = document.getElementById('formCart');

export function changeProductQuantity(id, count) {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('product_count', count)

    return sendForm('POST', '/cart/update_count_cart', formData)
        .then((result) => {
            let fullPrices = document.querySelectorAll('.js-full-price');
            let fullMinicartPrice = document.querySelector('.totals-minicart__value span');

            fullMinicartPrice.textContent = formatNumber(result.total);

            fullPrices.forEach((el) => {
                el.textContent = formatNumber(result['all_total_promo'] !== "" ? result['all_total_promo'] : result.total);
            });
            
            if(cartForm) {
                let fullPrice = document.getElementById('fullPrice');
                let totalPrice = document.getElementById('totalPrice');
                let promoTotal = document.getElementById('promoTotal');
                let priceWithDiscount = document.getElementById('priceWithDiscount');
                let pricePlusDelivery = document.getElementById('pricePlusDelivery');
                let totalPriceWithPromocode = document.getElementById('totalPriceWithPromocode');
                totalPrice.value = result.total;
                if(promoTotal) {
                    promoTotal.value = result.total;
                }
                totalPriceWithPromocode.value = result['all_total_promo'];
                fullPrice.textContent = formatNumber(result.total);

                priceWithDiscount.textContent = formatNumber(result.total - result['all_total_promo']);

                const delivery = document.getElementById('deliveryPrice');
                if (delivery.value != 0) {
                    pricePlusDelivery.textContent = formatNumber(delivery.value);

                    fullPrices.forEach((el) => {
                        el.textContent = formatNumber(result['all_total_promo'] !== "" ? +result['all_total_promo'] + +delivery.value : +result.total + +delivery.value)
                    })
                }
            }

            return result
        })
        .catch((err) => {
            
        })
}