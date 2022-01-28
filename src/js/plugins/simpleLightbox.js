import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom'
import lgVideo from 'lightgallery/plugins/video'

export default function initLightbox() {
    lightGallery(document.querySelector('.grid'), {
        plugins: [lgZoom],
        speed: 500,
        download: false,
        mobileSettings: {
            controls: true,
            showCloseIcon: true,
        },
    });

    lightGallery(document.querySelector('.slider-product__items'), {
        plugins: [lgZoom, lgVideo],
        speed: 500,
        download: false,
        mobileSettings: {
            controls: true,
            showCloseIcon: true,
        },
    });

    document.querySelectorAll('.slider-partner__items').forEach((el) => {
        lightGallery(el, {
            plugins: [lgZoom],
            speed: 500,
            download: false,
            counter: false,
            mobileSettings: {
                controls: true,
                showCloseIcon: true,
            },
        });
    })

    document.querySelectorAll('.item-review-product__images').forEach((el) => {
        lightGallery(el, {
            plugins: [lgZoom],
            speed: 500,
            download: false,
            mobileSettings: {
                controls: true,
                showCloseIcon: true,
            },
        });
    })
}
