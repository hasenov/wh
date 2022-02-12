import Swiper, { Autoplay, Navigation, Thumbs, Scrollbar, EffectFade, Pagination, Lazy } from 'swiper';
import enquire from "enquire.js";

export default function initSwiper() {
	Swiper.use([Autoplay, Navigation, Thumbs, Scrollbar, EffectFade, Pagination, Lazy]);
	
	// Слайдер витрина
	const swiperHero = new Swiper('.hero-slider', {
		slidesPerView: 1,
		loop: true,
		allowTouchMove: true,
		speed: 500,
		pagination: {
			el: '.hero-slider__pagination',
			type: 'bullets',
			clickable: true,
		},
		breakpoints: {
			1200: {
				allowTouchMove: false,
			}
		},
	});
	
	// Слайдер популярных моделей
	const swiperProducts = new Swiper('.section-popular .slider-products', {
		slidesPerView: 1.9,
		spaceBetween: 10,
		loop: true,
		preloadImages: false,
		lazy: {
			checkInView: true,
		},
		navigation: {
			prevEl: '.section-popular .slider-products__nav_prev',
			nextEl: '.section-popular .slider-products__nav_next',
		},
		breakpoints: {
			1200: {
				slidesPerView: 4,
				spaceBetween: 20,
			},
			992: {
				slidesPerView: 3.5,
				spaceBetween: 20,
			},
			768: {
				slidesPerView: 2.5,
				spaceBetween: 20,
			}
		}
	});

	// Слайдер рекомендуемых товаров
	const swiperSimilarProducts = new Swiper('.section-similar-products .slider-products', {
		slidesPerView: 1.9,
		spaceBetween: 10,
		loop: false,
		preloadImages: false,
		lazy: {
			checkInView: true,
		},
		navigation: {
			prevEl: '.section-similar-products .slider-products__nav_prev',
			nextEl: '.section-similar-products .slider-products__nav_next',
		},
		breakpoints: {
			1200: {
				slidesPerView: 5,
				spaceBetween: 20,
			},
			992: {
				slidesPerView: 3.5,
				spaceBetween: 20,
			},
			768: {
				slidesPerView: 2.5,
				spaceBetween: 20,
			}
		}
	});

	// Слайдер отзывов
	const swiperReviewsThumbsElement = document.querySelector('.thumbs-reviews');
	const swiperReviewsMainElement = document.querySelector('.main-reviews');
	
	if(swiperReviewsThumbsElement && swiperReviewsMainElement) {
		let swiperReviewsThumbs = initSwiperReviewsThumbs({
			slidesPerView: 3,
		});
		let swiperReviewsMain = initSwiperReviewsMain();
	
		function initSwiperReviewsThumbs(options) {
			return new Swiper('.thumbs-reviews', {
				direction: 'vertical',
				watchSlidesProgress: true,
				spaceBetween: 15,
				slideToClickedSlide: true,
				scrollbar: {
					el: '.thumbs-reviews__scrollbar',
					draggable: true,
				},
				breakpoints: {
					1200: {
						slidesPerView: 3.4,
					}
				},
				...options,
			});
		}
		
		function initSwiperReviewsMain(options) {
			return new Swiper('.main-reviews', {
				allowTouchMove: false,
				effect: 'fade',
				preloadImages: false,
				lazy: {
					checkInView: true,
				},
				fadeEffect: {
					crossFade: true
				},
				thumbs: {
					swiper: swiperReviewsThumbs
				},
				...options,
			});
		}
		
		function combineReviewsSwipers(swiperReviewsThumbs, swiperReviewsMain) {
			swiperReviewsMain.on('slideChangeTransitionStart', function() {
				swiperReviewsThumbs.slideTo(swiperReviewsMain.activeIndex);
			});
			
			swiperReviewsThumbs.on('transitionStart', function() {
				swiperReviewsMain.slideTo(swiperReviewsThumbs.activeIndex);
			});
		}
	
		combineReviewsSwipers(swiperReviewsThumbs, swiperReviewsMain);
	
		enquire.register("screen and (max-width:992px)", {
			match: function() {
				swiperReviewsThumbs.detachEvents();
				swiperReviewsMain.detachEvents();
				swiperReviewsThumbs.destroy();
				swiperReviewsMain.destroy();

				swiperReviewsThumbs = undefined;
				swiperReviewsMain = undefined;
		
				swiperReviewsThumbs = initSwiperReviewsThumbs({
					direction: 'horizontal',
					scrollbar: false,
					slidesPerView: 'auto',
					spaceBetween: 10,
				});

				swiperReviewsMain = initSwiperReviewsMain({
					allowTouchMove: true,
				});
			},
			unmatch: function() {
				swiperReviewsThumbs.destroy();
				swiperReviewsMain.destroy();
		
				swiperReviewsThumbs = initSwiperReviewsThumbs();
				swiperReviewsMain = initSwiperReviewsMain();

				combineReviewsSwipers(swiperReviewsThumbs, swiperReviewsMain);
			},
		});
	}
	
	// Слайдер галлерея партнёров
	const swipersPartnersGalleryElements = document.querySelectorAll('.slider-partner');
	swipersPartnersGalleryElements.forEach(function(element) {
		const swiperPartnersGallery = new Swiper(element, {
			slidesPerView: 1.2,
			spaceBetween: 7,
			nested: true,
			loop: true,
			preloadImages: false,
			lazy: {
				checkInView: true,
			},
			navigation: {
				nextEl: '.slider-partner__nav_next',
			},
			breakpoints: {
				1200: {
					slidesPerView: 2,
				},
				576: {
					slidesPerView: 1.5,
				}
			}
		});
	});
	
	// Слайдер партнёров
	const swiperPartnersElement = document.querySelector('.partners');
	if(swiperPartnersElement) {
		let swiperPartners = undefined;
	
		function initSwiperPartners(options) {
			return new Swiper(swiperPartnersElement, {
				slidesPerView: 1.11,
				spaceBetween: 10,
				loop: false,
				breakpoints: {
					576: {
						spaceBetween: 26,
						slidesPerView: 1.125,
					}
				},
				...options,
			});
		}
	
		enquire.register("screen and (max-width:992px)", {
			match: function() {
				swiperPartners = initSwiperPartners();
			},
			unmatch: function() {
				swiperPartners.destroy();
			},
		});
	}
	
	// Слайдер рекомендуемых статей
	const swiperSimilarElement = document.querySelector('.similar-content__slider');
	if(swiperSimilarElement) {
		let swiperSimilar = undefined;
	
		function initSwiperSimilar(options) {
			return new Swiper(swiperSimilarElement, {
				slidesPerView: 1.05,
				spaceBetween: 10,
				watchSlidesProgress: true,
				loop: false,
				breakpoints: {
					1200: {
						slidesPerView: 2.9,
					},
					992: {
						slidesPerView: 2.9,
					},
					768: {
						slidesPerView: 2.2,
					},
					576: {
						slidesPerView: 1.1,
						spaceBetween: 20,
					},
				},
				...options,
			});
		}
	
		enquire.register("screen and (max-width:1200px)", {
			match: function() {
				swiperSimilar = initSwiperSimilar();
			},
			unmatch: function() {
				swiperSimilar.destroy();
			},
		});
	}
	
	// Слайдер галерея товара
	const swiperProductGallery = new Swiper('.slider-product', {
		slidesPerView: 1,
		spaceBetween: 13,
		loop: false,
		preloadImages: false,
		lazy: true,
		navigation: {
			prevEl: '.slider-product__nav_prev',
			nextEl: '.slider-product__nav_next',
		},
		pagination: {
			el: '.slider-product__pagination',
			type: 'bullets',
			clickable: true,
		},
		breakpoints: {
			576: {
				slidesPerView: 2,
			}
		}
	});

	// Слайдер реальных отзывов
	const swiperModalGallery = new Swiper('.slider-modal-gallery', {
		slidesPerView: 1,
		spaceBetween: 13,
		loop: true,
		preloadImages: false,
		lazy: {
			checkInView: true,
		},
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		pagination: {
			el: '.slider-modal-gallery__pagination',
			type: 'bullets',
			clickable: true,
		},
	});
}