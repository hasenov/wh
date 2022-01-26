import priorityNav from 'priority-nav';

export default function initPriorityNav() {
    var nav = priorityNav.init({
        mainNavWrapper: ".bottom-header__menu", 
        mainNav: ".menu__list",
        navDropdownLabel: '...',
        turnOffPoint: 768
    });
}