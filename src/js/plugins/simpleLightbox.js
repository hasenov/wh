import SimpleLightbox from 'simple-lightbox'

export default function initLightbox() {
    new SimpleLightbox({elements: '.grid__link'});
    new SimpleLightbox({elements: '.item-slider-partner__link'});
    new SimpleLightbox({elements: '.item-slider-product__link'});
    new SimpleLightbox({elements: '.item-review-product__image-link'});
}
