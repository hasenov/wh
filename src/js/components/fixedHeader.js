import enquire from "enquire.js";

export default function initFixedHeader() {
    const header = document.querySelector('.header')
    const headerTop = document.querySelector('.top-header')
    const headerBottom = document.querySelector('.bottom-header');
    const headerWidgetsContainer = document.querySelector('.top-header__actions-wrap')
    const navPanelWidgetsContainer = document.querySelector('.bottom-header__actions-wrap')
    const headerWidgets = document.querySelector('.actions-header')
    const fixedClass = 'sticky'

    let offset = headerBottom.getBoundingClientRect().height + 'px';
    let breakpointMd = false;
    let notification = document.querySelector('.notification.active');
    console.log(notification)
    enquire.register("screen and (max-width:768px)", {
        match: function() {
            offset = headerTop.getBoundingClientRect().height + 'px';
            breakpointMd = true;
            fixHeader();
        },
        unmatch: function() {
            breakpointMd = false;
            offset = headerBottom.getBoundingClientRect().height + 'px';
            fixHeader();
        },
    })

    function fixHeader() {
        let shouldBeFixed = breakpointMd && !notification ? pageYOffset > 0 : pageYOffset > headerTop.getBoundingClientRect().height
        if(breakpointMd && notification) {
            shouldBeFixed = pageYOffset > notification.getBoundingClientRect().height
        }
        if (shouldBeFixed) fix()
        else unfix()
    }

    function fix() {
        if(breakpointMd) {
            header.style.paddingTop = offset;
        } else {
            headerTop.style.marginBottom = offset;
        }
        header.classList.add(fixedClass)
        if (headerWidgets.parentElement !== navPanelWidgetsContainer && !breakpointMd) {
            navPanelWidgetsContainer.appendChild(headerWidgets)
        }
    }

    function unfix() {
        if(breakpointMd) {
            header.style.paddingTop = '';
            headerTop.style.marginBottom = ''
        } else {
            headerTop.style.marginBottom = ''
        }
        
        header.classList.remove(fixedClass)
        if (headerWidgets.parentElement !== headerWidgetsContainer) {
            headerWidgetsContainer.appendChild(headerWidgets)
        }
    }

    fixHeader()
    document.addEventListener('scroll', fixHeader, {passive: true})

    // Система уведомлений
    document.addEventListener('click', function(e) {
        const deleteNotification = e.target.closest('.notification__close');
		if(deleteNotification) {
			const notif = deleteNotification.closest('.notification')
			localStorage.setItem(notif.id, 'closed');
			notif.remove()
            notification = null;
		}
    })
	const currentNotifys = [...document.querySelectorAll('.notification')];
	const currentNotify = currentNotifys.find((el) => {
		return !localStorage.getItem(el.id)
	});
	if(currentNotify) {
		currentNotify.classList.add('active');
        notification = currentNotify;
	}
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


