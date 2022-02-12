import { toggle, hide } from "slidetoggle"
import enquire from "enquire.js";

export default function initFaq() {
    const faqContainer = document.querySelector('.faq');
    const tabsContainer = document.querySelector('.tabs-faq');

    let md = false;
    enquire.register("screen and (max-width:992px)", {
        match: function() {
            md = true;
        },
        unmatch: function() {
            md = false;
        },
    })

    if(faqContainer) {
        faqContainer.addEventListener('click', function(e) {
            const tab = e.target.closest('.tab-faq')
            if(tab) {
                const index = tab.getAttribute('data-tab-toggle');

                function closeTabs() {
                    faqContainer.querySelectorAll('.content-faq__block.active').forEach((el) => {
                        el.classList.remove('active');
                    })
                    faqContainer.querySelectorAll('.tabs-faq__tab.active').forEach((el) => {
                        el.classList.remove('active');
                    })
                }

                if(!md) {
                    closeTabs();
                    tab.classList.add('active');
                    faqContainer.querySelector(`#faqBlock${index}`)?.classList.add('active');
                } else {
                    if(!tab.classList.contains('active')) {
                        closeTabs();
                        tab.classList.add('active');
                        faqContainer.querySelector(`#faqBlock${index}`)?.classList.add('active');
                    } else {
                        closeTabs();
                    }
                }
                
            }

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
        });
    }
}