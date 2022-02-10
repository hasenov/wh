import MicroModal from 'micromodal';
import { show } from 'slidetoggle';

export default function initMicroModal() {
    MicroModal.init({
        awaitCloseAnimation: true,
        disableFocus: true,
        onShow: (modal) => {
            if(modal.id === 'modal-categories') {
                const activeCategory = document.querySelector('.categories__item.active');
                if(activeCategory) {
                    const parent = activeCategory.closest('.categories__section');
                    const content = activeCategory.closest('.categories__list');
                    show(content, {
                        transitionFunction: 'ease',
                        onAnimationStart: () => {
                            parent.classList.add('active');
                        },
                    });
                }
            }
        },
        onClose: (modal) => {
            if(modal.closest('.item-filter')) {
                modal.closest('.item-filter').classList.remove('active')
            }
        }
    });
}