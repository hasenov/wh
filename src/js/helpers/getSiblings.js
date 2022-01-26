export const getSiblings = (elem, selector = false) => [...elem.parentElement.children].filter(item => {
    if (item === elem) return false;
    if (selector && !item.matches(selector)) return false;
    return true;
});