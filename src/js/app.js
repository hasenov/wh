import initPlugins from './plugins';
import initComponents, { initCookies } from './components';
import initWishlist from './components/wishlist';
import './components/catalog';
import { sendForm } from './services/api.service';
import { toggle, show, hide } from 'slidetoggle';
import MicroModal from 'micromodal';
import enquire from 'enquire.js';
import { changeProductQuantity } from './components/productQuantity'
import { formatNumber } from './helpers/formatNumber';
import OverlayScrollbars from 'overlayscrollbars';

import { removeFileFromFileList } from './helpers/removeFileFromFileList';
import updateMiniCart from './components/miniCart';

document.addEventListener('DOMContentLoaded', function() {
	initPlugins();
	initComponents();

	if(!localStorage.getItem('notification-system')) {
		document.querySelector('.header').insertAdjacentHTML('beforebegin', `
			<div class="notifications">
				<div class="notifications__item notification">
					<div class="notification__container container">
						<div class="notification__content">Уважаемые клиенты. С 1 по 10 января наш магазин не работает. Все заявки будут обработаны 11 января.</div>
						<button class="notification__close close" type="button">
							<svg>
								<use href="assets/img/svg-sprite/sprite.svg#close"></use>
							</svg>
						</button>
					</div>
				</div>
			</div>
		`)
	}

	const microModalOptions = {
		awaitCloseAnimation: true,
		disableFocus: true,
	}

	// Модалка подписка на рассылку
	const newsletterForms = document.querySelectorAll('.form-newsletter');

	newsletterForms.forEach((form) => {
		form.addEventListener('submit', e => {
			e.preventDefault();
			onNewsletterFormsSubmit(form);
		});
	})

	function onNewsletterFormsSubmit(form) {
		const email = new FormData(form);
			
		sendForm('POST', '/main/subscription', email)
			.then((res) => {
				MicroModal.close('modal-newsletter');
				MicroModal.show('modal-subscribe-success', microModalOptions);
			})
	}

	//проверка на наличие сессии
	var data = SessionValue;
	if (!data) {
		showNewsletterModal();
	}

	function showNewsletterModal() {
		setTimeout(function() {
			MicroModal.show('modal-newsletter', microModalOptions);
		}, 5000);
	}

	function sendNewsletterLater() {
		let formData = new FormData();
		formData.append('close', '1');
		sendForm('POST', '/main/closeSubscription', formData);
	}

	resizeQuantityInputs();

	// Заказы личного кабинета

	const ordersCabinet = document.querySelector('.orders-cabinet');
	if(ordersCabinet) {
		ordersCabinet.addEventListener('click', function(e) {
			const orderButton = e.target.closest('.order-cabinet__button');
			if(orderButton) {
				const orderContent = orderButton.parentElement.querySelector('.order-cabinet__body');
	
				if(!orderButton.classList.contains('active')) {
					show(orderContent, {
						transitionFunction: 'ease',
						onAnimationStart: () => {
							orderButton.classList.add('active');
						},
					});
				} else {
					hide(orderContent, {
						transitionFunction: 'ease',
						onAnimationStart: () => {
							orderButton.classList.remove('active');
						},
					});
				}
			}
		});
	}

	const passwordTogglers = document.querySelectorAll('.toggle-pas');
	passwordTogglers.forEach((el) => {
		el.addEventListener('click', function (e) {
			const password = el.closest('.control-field').querySelector('.control-pas');
			const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
			password.setAttribute('type', type);
			this.classList.toggle('active');
		});
	});

	enquire.register("screen and (min-width:992px)", {
		match: function() {
			const activeAsideCategory = document.querySelector('.categories__section.active');
			if(activeAsideCategory) {
				const content = activeAsideCategory.querySelector('.categories__list');
				show(content, {
					transitionFunction: 'ease',
				});
			}
		},
	});

	// Wishlist init
	initWishlist();
	updateMiniCart();

	inputNumber.init();
	// Click events
	document.documentElement.addEventListener('click', (e) => {
		const newsletterLater = e.target.closest('.form-modal__btn_later');
		if(newsletterLater) {
			MicroModal.close('modal-newsletter');
			sendNewsletterLater();
		}

		const quantityBtn = e.target.closest('.quantity__btn')
		if (quantityBtn) {
			inputNumber.calc(quantityBtn)

			const count = quantityBtn.closest('.quantity').querySelector('.quantity__control').value

			const itemOrder = quantityBtn.closest('.item-order')
			const id = itemOrder.dataset.id
			
			const result = changeProductQuantity(id, count)
		}

		const deleteBtn = e.target.closest('.box-minicart__order .item-order__delete-btn')
		if(deleteBtn) {
			const itemOrder = deleteBtn.closest('.item-order');
			const formData = new FormData();
			let fullMinicartPrice = document.querySelector('.totals-minicart__value span');

			var id = itemOrder.dataset.id;

			formData.append('id', id);

			
            let fullPrices = document.querySelectorAll('.js-full-price');

			const cartForm = document.querySelector('.cart__form');

			sendForm('POST', '/cart/deleteitem', formData)
				.then((result) => {
					if (result.count_product == 0) {
						updateMiniCart();
						if(cartForm) {
							location.reload();
						}
					}

					console.log(result)
			
					document.querySelectorAll(`.item-order[data-id="${id}"]`).forEach((el) => {
						el.remove();
					})

					fullMinicartPrice.textContent = formatNumber(result.total);

					fullPrices.forEach((el) => {
						el.textContent = formatNumber(result['all_total_promo']);
					});

					if(cartForm) {
						let fullPrice = document.getElementById('fullPrice');
						let totalPrice = document.getElementById('totalPrice');
						let priceWithDiscount = document.getElementById('priceWithDiscount');
						let pricePlusDelivery = document.getElementById('pricePlusDelivery');
						fullPrice.textContent = formatNumber(result.total);

						totalPrice.value = result.total;
						document.getElementById('totalPriceWithPromocode').value = result['all_total_promo'];
                		priceWithDiscount.textContent = formatNumber(result.total - result['all_total_promo']);

						const delivery = document.getElementById('deliveryPrice');
						if (delivery.value != 0) {
							pricePlusDelivery.textContent = formatNumber(delivery.value);

							fullPrices.forEach((el) => {
								el.textContent = formatNumber(+result['all_total_promo'] + +delivery.value)
							})
						}
					}
				})
				.catch((err) => {
					console.log(err)
				})
		}

		const triggerModalLogin = e.target.closest('.trigger-modal-login');
		const triggerModalRegister = e.target.closest('.trigger-modal-register');
		const triggerModalReset = e.target.closest('.trigger-modal-reset');
		if(triggerModalLogin) {
			MicroModal.close('modal-register');
			MicroModal.show('modal-login', microModalOptions);
		}
		if(triggerModalRegister) {
			MicroModal.close('modal-login');
			MicroModal.show('modal-register', microModalOptions);
		}
		if(triggerModalReset) {
			MicroModal.close('modal-register');
			MicroModal.close('modal-login');
			MicroModal.show('modal-reset', microModalOptions);
		}

		const searchBtn = e.target.closest('.search__btn');
		if(searchBtn) {
			const searchForm = document.querySelector('.search__form');
			searchForm.classList.add('active');

			window.onclick = function(e) {
				if (!e.target.closest('.search__form') && !e.target.closest('.search')) {
					searchForm.classList.remove('active');
				}
			}
		}

		const categoriesBtn = e.target.closest('.categories__header');
		if(categoriesBtn) {
			const item = categoriesBtn.closest('.categories__section');
			const content = item.querySelector('.categories__list');

			toggle(content, {
				transitionFunction: 'ease',
				onAnimationStart: () => {
					item.classList.add('active');
				},
				onClose: () => {
					item.classList.remove('active');
				},
			});
		}

		const share = e.target.closest('.share__btn');
		if(share) {
			share.parentElement.classList.toggle('active');
		}

		const copyToClipboard = e.target.closest('.copy-to-clipboard');
		if(copyToClipboard) {
			copyUrlToClipBoard();
		}

		const deletePhoto = e.target.closest('.item-file__delete');
		if(deletePhoto) {
			const item = deletePhoto.closest('.item-file');
			const items = deletePhoto.closest('.files-input__items');
			const nodes = Array.prototype.slice.call(items.children);
			
			const index = nodes.indexOf(item);

			removeFileFromFileList(index, '#commentPhotos');

			item.remove();
		}

		const deleteNotification = e.target.closest('.notification__close');
		if(deleteNotification) {
			const notif = deleteNotification.closest('.notifications')
			notif.remove()
			localStorage.setItem('notification-system', 'closed');
		}

	});

	const MouseParallax = function (selector) {
		const element = document.querySelector(selector)
	
		if (!element) return
	
		const moveElement = e => {
			const x = parseFloat((e.pageX - window.innerWidth / 2) * -0.03)
			const y = parseFloat((e.pageY - window.innerHeight / 2) * -0.03)
			element.style.transform = `translate3d(${x}px, ${y}px, 0)`
		}
	
		document.addEventListener('mousemove', e => {
			moveElement(e)
		}, {passive: true})
	}
	
	MouseParallax('.mouse-parallax')

	let instances = undefined

	function initInstances() {
		instances = OverlayScrollbars(document.querySelectorAll('.scrollbar-accent'), {
			className: "os-theme-accent",
			scrollbars: {
				clickScrolling: true,
			},
		});
	}

	initInstances()

	enquire.register("screen and (max-width:992px)", {
		match: function() {
			if(Array.isArray(instances)) {
				instances.forEach(instance => {
					instance.destroy()
				});
			} else {
				instances.destroy()
			}
		},
		unmatch: function() {
			initInstances()
		},
	});

	
	// Auth
	const authForms = [document.forms['formLogin'], document.forms['formRegister'], document.forms['formReset']]
	authForms.forEach((form) => {
		form?.addEventListener('submit', (e) => {
			e.preventDefault();
			const formData = new FormData(form);
			
			sendForm('POST', form.getAttribute('action'), formData)
				.then((res) => {
					const feedback = form.querySelector('.form-modal__feedback');
					
					if(res.success == '0') {
						feedback.style.display = 'block';
						feedback.innerHTML = '';
						feedback.insertAdjacentHTML('afterbegin', res.messages);
						return;
					}

					feedback.style.display = 'none';

					window.location.href = '/cabinet';
				})
				.catch((err) => {
				})
		});
	})

});

window.addEventListener('load', initCookies)

export function resizeQuantityInputs() {
	const quantityControls = document.querySelectorAll('.quantity__control');
	quantityControls.forEach((control) => {
		control.addEventListener('input', resizeInput);
		resizeInput.call(control);
	})
}

function resizeInput() {
	this.style.width = this.value.length + "ch";
}

const copyUrlToClipBoard = function (cb) {
    const url = location.href
    const input = document.createElement('input')
    input.type = 'text'
    document.body.appendChild(input)

    input.value = url
    input.select()
    document.execCommand('copy')
    input.remove()

    alert('Ссылка скопирована в буфер обмена')
}

const inputNumber = (() => {
    return {
        calc(eventTarget) {
            const input = eventTarget.parentElement.querySelector('.quantity__control')
			const minus = eventTarget.parentElement.querySelector('.quantity__btn_minus')
			const plus = eventTarget.parentElement.querySelector('.quantity__btn_plus')
            const {min = 1, max = 100, step = 1} = this.getProps(input, ['min', 'max', 'step'])
            const val = parseFloat(input.value)

            input.value = this[this.getAction(eventTarget)](val, min, max, step)

			resizeInput.call(input)

			if(input.value > min) {
				this.enableControl(minus);
			}
			if(input.value == max) {
				this.disableControl(plus);
			}
			if(input.value == min) {
				this.disableControl(minus);
			}

			return input.value;
        },
        getProps(input, props) {
            const result = {}

            props.forEach(attr => {
                let val = parseFloat(input.getAttribute(attr))
                if (!isNaN(val)) result[attr] = val
            })

            return result
        },
        plus(val, min, max, step) {
            const result = parseFloat((val + step).toFixed(2))
            return result > max ? val : result
        },
        minus(val, min, max, step) {
            const result = parseFloat((val - step).toFixed(2))
            return result < min ? val : result
        },
        getAction(trigger) {
            return trigger.classList.contains('quantity__btn_plus') ? 'plus' : 'minus'
        },
		enableControl(control) {
			control.disabled = false;
		},
		disableControl(control) {
			control.disabled = true;
		},
		init() {
			document.querySelectorAll('.quantity__control').forEach((el) => {
				if(el.value <= 1) {
					this.disableControl(el.closest('.quantity').querySelector('.quantity__btn_minus'))
				}
			})
		}
    }
})()