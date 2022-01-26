import MicroModal from 'micromodal';
import { show } from 'slidetoggle';
import floatLabel from '../components/floatLabel';

export default function initMicroModal() {
    MicroModal.init({
        awaitCloseAnimation: true,
        disableFocus: true,
        onShow: (modal) => {
            if(modal.id === 'modal-categories') {
                const activeAsideCategory = document.querySelector('.categories__section.active');
                if(activeAsideCategory) {
                    const content = activeAsideCategory.querySelector('.categories__list');
                    show(content, {
                        transitionFunction: 'ease',
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