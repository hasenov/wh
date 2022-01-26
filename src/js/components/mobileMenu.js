var hamburger = document.querySelector('.header__hamburger');
var bottomHeader = document.querySelector('.bottom-header');

export default function initMobileMenu() {
    hamburger.addEventListener('click', function() {
        bottomHeader.classList.toggle('active');
        document.querySelector('html').classList.toggle('lock');
    });
    
    document.querySelector('.topline-bottom-header').addEventListener('click', function() {
        bottomHeader.classList.toggle('active');
        document.querySelector('html').classList.toggle('lock');
    });
}