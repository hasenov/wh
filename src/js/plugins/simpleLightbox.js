import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom'
import lgVideo from 'lightgallery/plugins/video'

export default function initLightbox() {
    const opts = {
        plugins: [lgZoom],
        speed: 500,
        download: false,
        mobileSettings: {
            controls: true,
            showCloseIcon: true,
        },
    }

    lightGallery(document.querySelector('.grid'), {
        ...opts
    });

    lightGallery(document.querySelector('.slider-product__items'), {
        ...opts,
        plugins: [lgZoom, lgVideo],
    });

    document.querySelectorAll('.slider-partner__items').forEach((el) => {
        lightGallery(el, {
            ...opts,
            counter: false,
        });
    })

    document.querySelectorAll('.item-review-product__images').forEach((el) => {
        lightGallery(el, {
            ...opts
        });
    })
}
