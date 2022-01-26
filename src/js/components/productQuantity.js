import { sendForm } from "../services/api.service"
import { formatNumber } from "../helpers/formatNumber"

export function changeProductQuantity(id, count) {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('product_count', count)

    const cartForm = document.querySelector('.cart__form');

    sendForm('POST', '/cart/update_count_cart', formData)
        .then((result) => {
            let fullPrices = document.querySelectorAll('.js-full-price');
            let fullMinicartPrice = document.querySelector('.totals-minicart__value span');

            fullMinicartPrice.textContent = formatNumber(result.total);

            fullPrices.forEach((el) => {
                el.textContent = formatNumber(result['all_total_promo']);
            });
            
            if(cartForm) {
                let fullPrice = document.getElementById('fullPrice');
                let promoTotal = document.getElementById('promoTotal');
                let priceWithDiscount = document.getElementById('priceWithDiscount');
                let pricePlusDelivery = document.getElementById('pricePlusDelivery');
                totalPrice.value = result.total;
                promoTotal.value = result.total;
                fullPrice.textContent = formatNumber(result.total);

                priceWithDiscount.textContent = formatNumber(result.total - result['all_total_promo']);

                const delivery = document.getElementById('deliveryPrice');
                if (delivery.value != 0) {
                    pricePlusDelivery.textContent = formatNumber(delivery.value);

                    fullPrices.forEach((el) => {
                        el.textContent = formatNumber(+result['all_total_promo'] + +delivery.value)
                    })
                }
            }

            return result
        })
        .catch((err) => {
            
        })
}