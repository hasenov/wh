import productCard from "../helpers/productCard";
import { sendForm } from "../services/api.service";

export default function initWishlist() {
    const container = document.querySelector('.content-wishlist__items')
    if(container) {
        const counters = document.querySelectorAll('.header-wishlist__count span')

        const wishlistCheckboxInput = document.querySelector('.content-wishlist__all .radio__input');
        const wishlistCheckboxLabel = document.querySelector('.content-wishlist__all .radio__label');
        const wishlistCheckboxOriginalText = wishlistCheckboxLabel.textContent;
        const wishlistCheckboxUncheckAllText = wishlistCheckboxLabel.dataset['uncheck-all'] || 'Снять отметки';

        const deleteSelectedBtn = document.querySelector('.content-wishlist__delete');

        let productIds = []
        let selectedIds = []
    
        function check(control) {
            const id = control.value
            if (control.checked) {
                addProduct(id)
            } else {
                removeProduct(id)
                if(selectedIds.includes(id)) {
                    removeSelected(id)
                    checkSelected();
                }
            }
        }
    
        function addProduct(id) {
            if (productIds.includes(id)) return
            productIds.push(id)
            const formData = new FormData
            formData.append('id', id)
            sendForm('POST', '/main/wishlist', formData)
                .then(rsp => {
                    document.querySelectorAll(`input[name="product_wishlist"][value="${id}"]`).forEach(e => e.checked = true)
                    updateCounters()
                })
        }
    
        function removeProduct(id, isSelected) {
            if (!productIds.includes(id)) return
            const wishlist_card = container.querySelector(`[data-id="${id}"]`)
            if (wishlist_card) {
                wishlist_card.remove()
            }
            const formData = new FormData
            formData.append('id', id)
            sendForm('POST', '/main/wishlist_remove', formData)
                .then(rsp => {
                    document.querySelectorAll(`input[name="product_wishlist"][value="${id}"]`).forEach(e => e.checked = false)
                    productIds.splice(productIds.indexOf(id), 1)
                    if(isSelected) {
                        selectedIds.splice(selectedIds.indexOf(id), 1)
                    }
                    updateCounters()
                })
        }
    
        function updateCounters() {
            for (let counter of counters) {
                if (productIds.length) {
                    counter.innerText = productIds.length
                    counter.parentElement.classList.add('active')
                    document.querySelector('.wishlist').classList.add('action-header_status')
                } else {
                    counter.innerText = ''
                    counter.parentElement.classList.remove('active')
                    document.querySelector('.wishlist').classList.remove('action-header_status')
                }
            }
        }
    
        function updateList() {
            sendForm('POST', '/main/wishlist_view', new FormData)
                .then(rsp => {
                    if (typeof rsp.products !== 'undefined' && rsp.products instanceof Array) {
                        container.innerHTML = ''
                        rsp.products.forEach((item) => {
                            container.innerHTML += productCard(
                                item,
                                document.getElementById('lang').value || 'rus',
                                document.getElementById('currency').value || 'Руб.',
                                true
                            ).html()
                        })
                        productIds = rsp.products.map((item) => 'pr' + item.id)
                    } else {
                        if (typeof productIds === 'undefined') {
                            productIds = []
                        }
                    }
                    updateCounters()
                    return productIds
                })
                .then(productIds => {
                    document.querySelectorAll(`input[name="product_wishlist"]`).forEach(e => e.checked = false)
                    productIds.forEach((item) => {
                        document.querySelectorAll(`input[name="product_wishlist"][value="${item}"]`).forEach(e => e.checked = true)
                    })
                })
                .catch(e => {
                    productIds = []
                    document.querySelectorAll(`input[name="product_wishlist"]`).forEach(e => e.checked = false)
                })
        }

        function addSelected(id) {
            if (selectedIds.includes(id)) return
            selectedIds.push(id)
        }

        function removeSelected(id) {
            if (!selectedIds.includes(id)) return
            selectedIds.splice(selectedIds.indexOf(id), 1)
        }

        function selectToggle(control) {
            const id = control.value
            if (control.checked) {
                addSelected(id)
            } else {
                removeSelected(id)
            }

            checkSelected();
        }

        function selectAll() {
            selectedIds = [...document.querySelectorAll(`input[name="product_selected"]`)].map(e => {
                e.checked = true
                return e.value
            })
        }

        function unSelectAll() {
            document.querySelectorAll(`input[name="product_selected"]`).forEach(e => {
                e.checked = false
            })

            selectedIds = []
        }

        function toggleSelectAll(control) {
            if(control.checked) {
                selectAll()
            } else {
                unSelectAll()
            }

            checkSelected();
        }

        function setSelectAllActive() {
            wishlistCheckboxLabel.textContent = wishlistCheckboxUncheckAllText;
            wishlistCheckboxInput.checked = true;
            deleteSelectedBtn.style.display = 'block';
        }

        function unsetSelectAllActive() {
            wishlistCheckboxLabel.textContent = wishlistCheckboxOriginalText;
            wishlistCheckboxInput.checked = false;
            deleteSelectedBtn.style.display = 'none';
        }

        function checkSelected() {
            if(selectedIds.length) {
                setSelectAllActive()
            } else {
                unsetSelectAllActive()
            }
        }

        updateList();
    
        // Events
        document.documentElement.addEventListener('click', function(e) {
            const wishlistCheckbox = e.target.closest('.wishlist-label__input');
            if(wishlistCheckbox) {
                check(wishlistCheckbox);
                return;
            }
    
            const wishlistModalTrigger = e.target.closest('.wishlist');
            if(wishlistModalTrigger) {
                updateList();
                return;
            }
    
            const wishlistSelect = e.target.closest('.card-product__radio input');
            if(wishlistSelect) {
                selectToggle(wishlistSelect);
                return;
            }

            const selectAll = e.target.closest('.content-wishlist__all input');
            if(selectAll) {
                toggleSelectAll(selectAll);
                return;
            }
        });

        deleteSelectedBtn.addEventListener('click', (e) => {
            selectedIds.forEach((id) => {
                removeProduct(id, true);
            })

            unsetSelectAllActive();
        });
    }
}