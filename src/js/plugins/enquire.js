import enquire from "enquire.js";

// Адаптивность, изменение положения элементов в зависимости от ширины экрана.
export default function initEnquire() {
    // Шапка
    const topHeaderColContacts = document.querySelector('.top-header__col_contacts');
    const topHeaderColActions = document.querySelector('.top-header__actions');
    const headerSearch = document.querySelector('.search');
    const headerWishlist = document.querySelector('.wishlist');
    
    const bottomHeaderContainer = document.querySelector('.bottom-header__container');
    const footerContacts = document.querySelector('.footer__contacts').cloneNode(true);
    const footerSocials = document.querySelector('.footer__socials').cloneNode(true);
    enquire.register("screen and (max-width:768px)", {
        match: function() {
            topHeaderColContacts.appendChild(headerSearch);
            topHeaderColContacts.appendChild(headerWishlist);
    
            bottomHeaderContainer.appendChild(footerContacts);
            bottomHeaderContainer.appendChild(footerSocials);
        },
        unmatch: function() {
            topHeaderColActions.prepend(headerWishlist);
            topHeaderColActions.prepend(headerSearch);
    
            bottomHeaderContainer.removeChild(footerContacts);
            bottomHeaderContainer.removeChild(footerSocials);
        },
    })

    // Секция популярные товары
    const sectionPopularContainer = document.querySelector('.section-popular .container');
    if(sectionPopularContainer) {
        const sectionPopularHeadline = sectionPopularContainer.querySelector('.headline');
        const sectionPopularBtnWrap = sectionPopularHeadline.querySelector('.headline__btn-wrap');
    
        if(sectionPopularHeadline && sectionPopularBtnWrap) {
            const sectionPopularBtn = sectionPopularBtnWrap.querySelector('.headline__btn');

            enquire.register("screen and (max-width:992px)", {
                match: function() {
                    sectionPopularContainer.appendChild(sectionPopularBtnWrap);

                    sectionPopularBtn.classList.remove('btn-outline-accent');
                    sectionPopularBtn.classList.add('btn-accent');
                },
                unmatch: function() {
                    sectionPopularHeadline.appendChild(sectionPopularBtnWrap);

                    sectionPopularBtn.classList.remove('btn-accent');
                    sectionPopularBtn.classList.add('btn-outline-accent');
                },
            })
        }
    }

    // Секция отзывы
    const sliderReviews = document.querySelector('.reviews-slider');
    if(sliderReviews) {
        const sectionReviewsHeadline = document.querySelector('.section-reviews .headline');
        
        if(sectionReviewsHeadline) {
            const sectionReviewsBtnWrap = sectionReviewsHeadline.querySelector('.headline__btn-wrap');
            if(sectionReviewsBtnWrap) {
                const sectionReviewsBtn = sectionReviewsBtnWrap.querySelector('.headline__btn');
                enquire.register("screen and (max-width:992px)", {
                    match: function() {
                        sliderReviews.after(sectionReviewsBtnWrap);
    
                        sectionReviewsBtn.classList.remove('btn-outline-accent');
                        sectionReviewsBtn.classList.add('btn-accent');
                    },
                    unmatch: function() {
                        sectionReviewsHeadline.appendChild(sectionReviewsBtnWrap);
    
                        sectionReviewsBtn.classList.remove('btn-accent');
                        sectionReviewsBtn.classList.add('btn-outline-accent');
                    },
                })
            }
        }
    }
    
    // Секция инстаграм
    const sectionInstagramContainer = document.querySelector('.section-instagram .container');
    if(sectionInstagramContainer) {
        const sectionInstagramHeadline = sectionInstagramContainer.querySelector('.headline');
        const sectionInstagramBtn = sectionInstagramHeadline.querySelector('.headline__btn-wrap');
    
        if(sectionInstagramHeadline && sectionInstagramBtn) {
            enquire.register("screen and (max-width:992px)", {
                match: function() {
                    sectionInstagramContainer.appendChild(sectionInstagramBtn);
                },
                unmatch: function() {
                    sectionInstagramHeadline.appendChild(sectionInstagramBtn);
                },
            })
        }
    }
    
    // Доставка и оплата
    const faqContainer = document.querySelector('.faq');
    if(faqContainer) {
        const tabs = document.querySelectorAll('.tab-faq');
        const tabsBlocks = document.querySelectorAll('.content-faq__block');
        const tabsBlocksContainer = document.querySelector('.content-faq__blocks');

        enquire.register("screen and (max-width:992px)", {
            match: function() {
                faqContainer.querySelector('.tab-faq.active')?.classList.remove('active');
                faqContainer.querySelector('.content-faq__block.active')?.classList.remove('active');
        
                tabs.forEach(function(tab, i) {
                    tab.after(document.querySelectorAll('.content-faq__block')[i]);
                });
            },
            unmatch: function() {
                tabsBlocks.forEach(function(tabsBlock, i) {
                    tabsBlocksContainer.appendChild(tabsBlock);
                });

                faqContainer.querySelector('.tab-faq').classList.add('active');
                faqContainer.querySelector('.content-faq__block').classList.add('active');
            },
        });
    }
    
    // Товар
    const infoProduct = document.querySelector('.info-product');
    if(infoProduct) {
        const sliderProduct = document.querySelector('.slider-product');
        const productRow = document.querySelector('.product__row');
    
        enquire.register("screen and (max-width:992px)", {
            match: function() {
                sliderProduct.after(infoProduct);
            },
            unmatch: function() {
                productRow.append(infoProduct);
            },
        })
    }

    // Каталог
    const filterItemsWrapper = document.querySelector('.filter__items');
    const filterItems = document.querySelectorAll('.filter__item:not(.item-filter_sort)');
    const filterItemSortRadiosWrapper = document.querySelector('.item-filter_sort .modal-popup .body-modal__container');
    const filterItemSortRadios = document.querySelector('.item-filter_sort .modal-popup__radios');
    const filterModalSortWrapper = document.querySelector('.modal-filter__sort');
    const filterModalItems = document.querySelector('.filters-modal__items');
    if(filterItems && filterModalItems) {
        enquire.register("screen and (max-width:992px)", {
            match: function() {
                filterItems.forEach((el) => {
                    filterModalItems.appendChild(el);
                });
                filterModalSortWrapper.appendChild(filterItemSortRadios);
            },
            unmatch: function() {
                filterItems.forEach((el) => {
                    filterItemsWrapper.appendChild(el);
                });
                filterItemSortRadiosWrapper.appendChild(filterItemSortRadios);
            },
        });
    }

    const filterSelectedParams = document.querySelector('.filter__selected-params-wrap .selected-params');
    const filterSelectedParamsWrapper = document.querySelector('.filter__selected-params-wrap');
    const asideCategories = document.querySelector('.aside-catalog__categories');
    if(filterSelectedParams && asideCategories && filterSelectedParamsWrapper) {
        enquire.register("screen and (max-width:992px)", {
            match: function() {
                asideCategories.appendChild(filterSelectedParams);
            },
            unmatch: function() {
                filterSelectedParamsWrapper.appendChild(filterSelectedParams);
            },
        });
    }
    
    const categoriesWrapper = document.querySelector('.categories');
    const categories = document.querySelector('.categories__sections');
    const categoriesModalContainer = document.querySelector('.modal-categories .body-modal__container')
    if(categoriesModalContainer) {
        enquire.register("screen and (max-width:992px)", {
            match: function() {
                categoriesModalContainer.appendChild(categories);
            },
            unmatch: function() {
                categoriesWrapper.appendChild(categories);
            },
        });
    }
    
    // Корзина
    const cartContent = document.querySelector('.cart__content');
    const cartTotals = document.querySelector('.totals-cart');
    const cartOrders = document.querySelector('.orders-cart');
    if(cartContent && cartTotals && cartOrders) {
        enquire.register("screen and (max-width:992px)", {
            match: function() {
                cartOrders.after(cartTotals);
            },
            unmatch: function() {
                cartContent.appendChild(cartTotals);
            },
        });
    }
    
    const checkoutPromoCodeWrap = document.querySelector('.aside-cart__item_promo-code');
    const checkoutPromoCode = document.querySelector('.aside-cart__promo-code');
    const checkoutTotals = document.querySelector('.totals-checkout');
    if(checkoutPromoCodeWrap && checkoutPromoCode && checkoutTotals) {
        enquire.register("screen and (max-width:992px)", {
            match: function() {
                checkoutTotals.after(checkoutPromoCode);
            },
            unmatch: function() {
                checkoutPromoCodeWrap.appendChild(checkoutPromoCode);
            },
        });
    }
    
    // Личный кабинет
    const menuCabinet = document.querySelector('.menu-cabinet');
    const asideCabinet = document.querySelector('.aside-cabinet');
    const modalMenuBody = document.querySelector('.modal-menu .body-modal__container');
    if(asideCabinet && menuCabinet && modalMenuBody) {
        enquire.register("screen and (max-width:992px)", {
            match: function() {
                modalMenuBody.appendChild(menuCabinet);
            },
            unmatch: function() {
                asideCabinet.appendChild(menuCabinet);
            },
        });
    }

    const cabinetRow = document.querySelector('.cabinet__row');
    const cabinetHeadline = document.querySelector('.cabinet .page-headline');
    const cabinetContent = document.querySelector('.cabinet__content');
    if(cabinetHeadline && cabinetContent && cabinetRow) {
        enquire.register("screen and (max-width:992px)", {
            match: function() {
                cabinetContent.before(cabinetHeadline);
            },
            unmatch: function() {
                cabinetRow.before(cabinetHeadline);
            },
        });
    }
    
    const cabinetMsg = document.querySelector('.form-cabinet__feedback');
    const cabinetForm = document.querySelector('.form-cabinet');
    const cabinetFooter = document.querySelector('.form-cabinet__footer');
    if(cabinetMsg && cabinetForm && cabinetFooter) {
        enquire.register("screen and (max-width:1200px)", {
            match: function() {
                cabinetForm.prepend(cabinetMsg);
            },
            unmatch: function() {
                cabinetFooter.appendChild(cabinetMsg);
            },
        });
    }

    // Калькулятор
    const ssCalculatorSteps = document.querySelector('.ssc__steps');
    const ssCalculatorModel = document.querySelector('.ssc__model');
    const ssCalculatorModelWrapper = document.querySelector('.ssc__model-wrap');
    if(ssCalculatorSteps && ssCalculatorModel && ssCalculatorModelWrapper) {
        enquire.register("screen and (max-width:1200px)", {
            match: function() {
                ssCalculatorSteps.before(ssCalculatorModel);
            },
            unmatch: function() {
                ssCalculatorModelWrapper.appendChild(ssCalculatorModel);
            },
        });
    }
}