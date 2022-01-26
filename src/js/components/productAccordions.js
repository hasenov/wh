import { toggle, hide, show } from "slidetoggle";
import enquire from "enquire.js";

const handleProductAccordionPC = function(e) {
    if (e.target.closest('.accordion-product__header')) {
        const wrapper = e.target.closest('.accordion-product');
        const content = wrapper.querySelector('.accordion-product__body');
        toggleProductAccordion(wrapper, content);

        resetAccordions('.content-product__accordions');
    }
}

const handleProductAccordionMobile = function(e) {
    if (e.target.closest('.accordion-product__header')) {
        const wrapper = e.target.closest('.accordion-product');
        const content = wrapper.querySelector('.accordion-product__body');
        toggleProductAccordion(wrapper, content);

        resetAccordions();
    }
}

function toggleProductAccordion(wrapper, content) {
    toggle(content, {
        transitionFunction: 'ease',
        onOpen: () => {
            wrapper.classList.add('active')
        },
        onClose: () => {
            wrapper.classList.remove('active')
        }
    });
}

function resetAccordions(scope) {
    document.querySelectorAll(`${scope ? scope + ' ' : ''}.accordion-product`).forEach((el) => {
        if(el.classList.contains('active')) {
            hide(el.querySelector('.accordion-product__body'), {
                transitionFunction: 'ease',
                onAnimationEnd: () => {
                    el.classList.remove('active')
                }
            })
        }
    })
}

export default function initProductAccordions() {
    const accordions = document.querySelectorAll('.accordion-product');
    if(accordions.length) {
        document.addEventListener('click', handleProductAccordionPC);
    
        const activeProductAccordion = document.querySelectorAll('.accordion-product.active');
        activeProductAccordion.forEach((el) => {
            const content = el.querySelector('.accordion-product__body');
            show(content, {
                transitionFunction: 'ease',
            });
        })
    
        const contentProductAccordion = document.querySelector('.content-product__accordion');
        const content = contentProductAccordion.querySelector('.accordion-product__body')

        enquire.register("screen and (max-width:992px)", {
            match: function() {
                contentProductAccordion.classList.remove('active');
                hide(content, {
                    transitionFunction: 'ease',
                });
                
                document.removeEventListener('click', handleProductAccordionPC);
                document.addEventListener('click', handleProductAccordionMobile);
            },
            unmatch: function() {
                contentProductAccordion.classList.add('active');
                show(content, {
                    transitionFunction: 'ease',
                });

                document.removeEventListener('click', handleProductAccordionMobile);
                document.addEventListener('click', handleProductAccordionPC);
            },
        })
    }
}