import svg4everybody from 'svg4everybody';
import initEnquire from './enquire';
import initSwiper from './swiper';
import initLightbox from './simpleLightbox';
import initPriorityNav from './priorityNav';
import initDatepicker from './datepicker';
import initMicroModal from './micromodal';
import 'salvattore/dist/salvattore';

export default function initPlugins() {
    initEnquire();
    initSwiper();
    svg4everybody();
    initLightbox();
    initPriorityNav();
    initDatepicker();
    initMicroModal();
}