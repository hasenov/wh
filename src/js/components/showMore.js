import { show, hide } from "slidetoggle";

export default function initShowMoreBtns() {
    const showMoreBtns = document.querySelectorAll('[data-more-target]');

    showMoreBtns.forEach(function(btn) {
        const toggler = btn.getAttribute('data-more-target');
        const target = document.getElementById(toggler);

        if(toggler && target !== null) {
            let expanded = false;
            const collapsedText = btn.getAttribute('data-more-collapsed-text') || 'Скрыть';
            const originalText = btn.querySelector('.show-more__text').textContent;
            const text = btn.querySelector('.show-more__text');

            btn.addEventListener('click', function() {
                btn.setAttribute('data-more-expanded-text', originalText);
                const expandedText = btn.getAttribute('data-more-expanded-text');
                if(!expanded) {
                    text.textContent = collapsedText;
                    btn.classList.add('active');
                    show(target, {
                        transitionFunction: 'ease',
                        onAnimationEnd: () => {
                            expanded = true;
                        }
                    });
                } else if(expanded) {
                    text.textContent = expandedText;
                    btn.classList.remove('active');
                    hide(target, {
                        transitionFunction: 'ease',
                        onAnimationEnd: () => {
                            expanded = false;
                        }
                    });
                }
            });
        }
    });
}