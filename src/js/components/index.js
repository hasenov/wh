import floatLabel from './floatLabel';
import initSpots from './imageSpots';
import initMobileMenu from './mobileMenu';
import initFixedHeader from './fixedHeader';
import initShowMoreBtns from './showMore';
import initTabs from './tabs';
import initFaqAccordions from './faqAccordions';
import initFooterAccordions from './footerAccordions';
import initProductAccordions from './productAccordions';
import initProduct from './product';
import initCertificate from './certificate';
import initCabinet from './cabinet';
import initConstructor from './calculator';
import initInputMasking from './inputMask';
import initCart from './cart';
import initFilesSelector from './filesSelector';
import initMasks from './mask';

export { initCookies } from './cookies';

export default function initComponents() {
	initMobileMenu();
	initFixedHeader();
    initSpots();
	initShowMoreBtns();
	initTabs();
    initFaqAccordions();
    initFooterAccordions();
    initProductAccordions();
    initProduct();
    initCertificate();
    initCabinet();
    initConstructor();
    initInputMasking('.phone-mask');
    floatLabel.init();
    initCart();
    initFilesSelector();
    initMasks();
}