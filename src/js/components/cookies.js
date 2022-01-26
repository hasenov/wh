const cookiePopup = document.querySelector(".cookie");

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
    const d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=;" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function acceptCookieConsent() {
    deleteCookie('wh_allowCookies');
    setCookie('wh_allowCookies', 1, 30);
    cookiePopup.classList.remove("active");
}

export const initCookies = function() {
    const acceptBtn = document.getElementById('cookie-btn-yes');
    acceptBtn.addEventListener('click', (e) => {
        acceptCookieConsent();
    });

    let cookie_consent = getCookie("wh_allowCookies");
    setTimeout(() => {
        if(cookie_consent != ""){
            cookiePopup.classList.remove("active");
        } else {
            cookiePopup.classList.add("active");
        }
    }, 2000)
}