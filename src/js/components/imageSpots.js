import enquire from "enquire.js";

const spotsWrap = document.querySelector('.spots-hero');

export default function initSpots() {
    if(spotsWrap) {
        enquire.register("screen and (min-width:992px)", {
            match: function() {
                enableSpots();
            },
            unmatch: function() {
                destroySpots();
            },
        });
    }
}

const handleSpotClick = function(e) {
    const spotBtn = e.target.closest('.item-spot__btn');
    if(spotBtn) {
        const spotBtnParent = spotBtn.closest('.item-spot');
        const spotBtnPlus = spotBtn.querySelector('.plus');
        
        spotBtnParent.classList.toggle('active');
        spotBtnPlus.classList.toggle('active');
    }
}

function enableSpots() {
    spotsWrap.addEventListener('click', handleSpotClick);

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.item-spot')) {
            var spots = document.getElementsByClassName("item-spot");
            var i;
            for (i = 0; i < spots.length; i++) {
                if (spots[i].classList.contains('active')) {
                    spots[i].classList.remove('active');
                    spots[i].querySelector('.plus').classList.remove('active');
                }
            }
        }
    })
}

function destroySpots() {
    spotsWrap.removeEventListener('click', handleSpotClick);
}