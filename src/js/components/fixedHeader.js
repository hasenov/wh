import enquire from "enquire.js";

export default function initFixedHeader() {
    const header = document.querySelector('.header')
    const headerTop = document.querySelector('.top-header')
    const headerWidgetsContainer = document.querySelector('.top-header__actions-wrap')
    const navPanelWidgetsContainer = document.querySelector('.bottom-header__actions-wrap')
    const headerWidgets = document.querySelector('.actions-header')
    const fixedClass = 'sticky'

    let breakpointMd = false;
    enquire.register("screen and (max-width:768px)", {
        match: function() {
            breakpointMd = true;
            fixHeader();
        },
        unmatch: function() {
            breakpointMd = false;
            fixHeader();
        },
    })

    function fixHeader() {
        const shouldBeFixed = !breakpointMd && (pageYOffset > headerTop.getBoundingClientRect().height)
        if (shouldBeFixed) fix()
        else unfix()
    }

    function fix() {
        header.classList.add(fixedClass)
        if (headerWidgets.parentElement !== navPanelWidgetsContainer) {
            navPanelWidgetsContainer.appendChild(headerWidgets)
        }
    }

    function unfix() {
        header.classList.remove(fixedClass)
        if (headerWidgets.parentElement !== headerWidgetsContainer) {
            headerWidgetsContainer.appendChild(headerWidgets)
        }
    }

    fixHeader()
    document.addEventListener('scroll', fixHeader, {passive: true})
}

// export default function initFixedHeader() {
//     var body = document.querySelector('body');
//     var headerBottom = document.querySelector('.bottom-header');
//     var headerBottomContainer = document.querySelector('.bottom-header__container');
//     var headerTopRow = document.querySelector('.top-header__row');
//     var headerActions = document.querySelector('.top-header__col_actions');

//     let shouldBeFixed = true;
//     enquire.register("screen and (max-width:768px)", {
//         match: function() {
//             shouldBeFixed = false;
//             fixHeader();
//         },
//         unmatch: function() {
//             shouldBeFixed = true;
//             fixHeader();
//         },
//     })
//     function fixHeader() {
//         if(shouldBeFixed && window.pageYOffset > 99) {
//             fix();
//         } else {
//             unfix();
//         }
//     }

//     function fix() {
//         body.classList.add('header-sticky');
//         headerBottom.classList.add('sticky');
//         if(headerActions.parentElement !== headerBottomContainer) {
//             headerBottomContainer.append(headerActions);
//         }
//     }

//     function unfix() {
//         body.classList.remove('header-sticky');
//         headerBottom.classList.remove('sticky');
//         if(headerActions.parentElement !== headerTopRow) {
//             headerTopRow.append(headerActions);
//         }
//     }

//     fixHeader();

//     document.addEventListener('scroll', fixHeader, {passive: true})
// }


















// var header = document.querySelector('.header');
// var headerBottom = document.querySelector('.bottom-header');
// var headerBottomContainer = document.querySelector('.bottom-header__container');
// var headerTopRow = document.querySelector('.top-header__row');
// var headerActions = document.querySelector('.top-header__col_actions');

// var handleFixedHeader = function() {
//     if (window.pageYOffset > headerBottom.offsetTop) {
//         headerBottom.classList.add("sticky");
//         setHeaderOffset(headerBottom.offsetHeight);
//         if(headerActions.parentElement !== headerBottomContainer) {
//             headerBottomContainer.append(headerActions);
//         }
//     } else {
//         headerBottom.classList.remove("sticky");
//         resetHeaderOffset();
//         headerTopRow.append(headerActions);
//     }
// }

// export function setHeaderOffset(value) {
//     header.style.marginBottom = value + 'px';
// }

// export function resetHeaderOffset() {
//     header.style.marginBottom = 0;
// }

// export function initFixedHeader() {
//     window.addEventListener('scroll', handleFixedHeader);

//     enquire.register("screen and (max-width:768px)", {
//         match: function() {
//             destroyFixedHeader();
//         },
//         unmatch: function() {
//             initFixedHeader();
//         },
//     })
// }

// export function destroyFixedHeader() {
//     window.removeEventListener('scroll', handleFixedHeader);
// }


