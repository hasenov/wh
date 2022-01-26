import { toggle, hide } from "slidetoggle"

const handleFaqAccordion = function(e) {
    const button = e.target.closest('.item-faq__button')
    if (button) {
        const item = button.closest('.item-faq')
        const content = item.querySelector('.item-faq__content')
        
        toggle(content, {
            transitionFunction: 'ease',
            onOpen: () => {
                item.classList.add('active')
            },
            onClose: () => {
                item.classList.remove('active')
            }
        })

        document.querySelectorAll('.item-faq').forEach((el) => {
            if(el.classList.contains('active')) {
                hide(el.querySelector('.item-faq__content'), {
                    transitionFunction: 'ease',
                    onAnimationEnd: () => {
                        el.classList.remove('active')
                    }
                })
            }
        })
    }
}

export default function initFaqAccordions() {
    const itemsFaq = document.querySelectorAll('.item-faq');
    if(itemsFaq.length) {
        document.addEventListener('click', handleFaqAccordion);
    }
}