import { toggle, hide } from "slidetoggle";
import enquire from "enquire.js";

const footerAccordionMenus = document.querySelectorAll('.footer__col_accordion .footer__menu');

const handleFooterAccordion = function(e) {
    if (e.target.closest('.footer__col_accordion .footer__title')) {
        const wrapper = e.target.closest('.footer__col_accordion');
        const content = wrapper.querySelector('.footer__menu');
        toggleFooterAccordion(wrapper, content);
    }
}

function toggleFooterAccordion(wrapper, content) {
    toggle(content, {
        transitionFunction: 'ease',
        onOpen: () => {
            wrapper.classList.add('active')
        },
        onClose: () => {
            wrapper.classList.remove('active')
        }
    })

    document.querySelectorAll('.footer__col_accordion').forEach((el) => {
        if(el.classList.contains('active')) {
            hide(el.querySelector('.footer__menu'), {
                transitionFunction: 'ease',
                onAnimationEnd: () => {
                    el.classList.remove('active')
                }
            })
        }
    })
}

function enableFooterAccordions() {
    document.addEventListener('click', handleFooterAccordion);
    footerAccordionMenus.forEach(function(el) {
        el.style.display = 'none';
    });
}

function destroyFooterAccordions() {
    document.removeEventListener('click', handleFooterAccordion);
    footerAccordionMenus.forEach(function(el) {
        el.style.display = 'block';
        el.style.height = 'auto';
    });
}

export default function initFooterAccordions() {
    enquire.register("screen and (max-width:768px)", {
        match: function() {
            enableFooterAccordions();
        },
        unmatch: function() {
            destroyFooterAccordions();
        },
    });
}