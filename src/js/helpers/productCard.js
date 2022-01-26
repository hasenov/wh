import { formatNumber } from "./formatNumber";

export default function productCard(product, lang, currency, wishlist_item = false) {
    const printPrices = product => {
        if (product.price == 0 || product.size_standards == 0 && product['sizes_avail'] == 0) {
            return '<div class="card-product__price">Нет в наличии</div>';

        } else if (product.discount > 0 && product.price !== 0) {
            const actualPrice = product.price;
            return `
                <ins class="card-product__price card-product__price_new">${formatNumber(actualPrice)} ${currency}</ins>
                <del class="card-product__old-price crossed">${formatNumber(product.old_price)} ${currency}</del>
            `;
        } else {
            return `
                <div class="card-product__price">${formatNumber(product.price)} ${currency}</div>
            `;
        }
    }

    return {
        html() {
			let sizes_avail = ''
            let size_standards = ''
            let sizes = ''
            let btn_buy
            if (product.available_sizes instanceof Array && product.available_sizes.length) {
                product.available_sizes.forEach(size => sizes_avail += `<li>${size}</li> `)
            }
            if (typeof(product.size_standards) !== 'undefined' && product.size_standards == '1') {
                size_standards = '<li>По меркам</li>'
            }
            if (sizes_avail || size_standards) {
                sizes += `<ul class="attributes__list">`
                sizes += sizes_avail
                sizes += size_standards
                sizes += '</ul>'
                btn_buy = `<a href="/catalog/${product.url}" class="card-product__btn btn btn-accent"><span>Купить</span></a>`
            }

			const title = product['title_' + lang]

			const wl_label_heart = '<svg class="wishlist-label__icon"><use href="assets/img/svg-sprite/sprite.svg#heart"></use></svg>'
			const wl_label_delete = '<span class="wishlist-label__delete-btn delete-btn"><svg class="delete-btn__icon"><use href="assets/img/svg-sprite/sprite.svg#trash"></use></svg></span>'

			const wl_label_content = wishlist_item ? wl_label_delete : wl_label_heart 

			return `
				<div class="card-product${!(sizes || size_standards) ? ' out-of-stock' : ''} ${wishlist_item ? ' content-wishlist__item col-xl-3 col-md-4 col-6' : ''}" ${wishlist_item ? 'data-id' : 'id'}="${wishlist_item ? 'pr' : ''}${product.id}">
					<div class="card-product__inner">
						${wishlist_item ?
						`
							<label class="card-product__radio radio">
								<input type="checkbox" class="radio__input" name="product_selected" value="pr${product.id}">
								<span class="radio__content">
									<span class="radio__dot"></span>
								</span>
							</label>
						` : ''}
						${(product.discount && product.discount > 0) ? 
							`<span class="card-product__label label-product">-${product.discount}%</span>` : 
						''}
						<label class="card-product__wishlist-label wishlist-label">
							<span class="screen-reader-text">${title}</span>
							<input type="checkbox" class="wishlist-label__input hidden" name="product_wishlist" value="pr${product.id}" ${wishlist_item && "checked"}>
							${wl_label_content}
						</label>
						<a href="/catalog/${product.url}" class="card-product__img-wrap dummy-bg">
							<img src="/images/products/thumb/${product.img}" alt="${title}" class="card-product__img img-responsive">
						</a>
						<div class="card-product__body">
							<div class="card-product__content">
								<div class="card-product__price-wrap">
									${printPrices(product)}
								</div>
								<a href="/catalog/${product.url}" class="card-product__title">${title}</a>
								<div class="card-product__attributes attributes">
									${sizes}
								</div>
							</div>
							${btn_buy ? `<div class="card-product__reveal">${btn_buy}</div>` : ''}
						</div>
					</div>
				</div>
			`;
		},
	}
}