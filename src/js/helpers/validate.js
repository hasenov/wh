const regExpDic = {
    email: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/,
    password: /^[0-9a-zA-Z]{4,}$/,
    phone: /^(\+7|7|8)?[\s\-]?\(?[9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
};

/**
 * Function validate. Check Input on RegExp provided in regExpDic by input data-required type
 * @param {HTMLInputElement} el
 * @returns {Boolean} - Return true if input valid or doesn't has data-required attr
 */
export function validate(el) {
    const regExpName = el.dataset.required;
    if (!regExpDic[regExpName]) return true;
    return regExpDic[regExpName].test(el.value);
}

export function showInputError(el) {
    const parent = el.closest('.control-field');
    if(!parent) return;

    const msg = el.dataset.invalidMessage || 'Invalid input';
    const template = inputErrorTemplate(msg);
    parent.classList.add('is-invalid');

    const err = parent.querySelector('.control-field__msg');
    if (err) {
        parent.removeChild(err);
    };

    parent.insertAdjacentHTML('beforeend', template);
}

export function removeInputError(el) {
    const parent = el.closest('.control-field');
    if(!parent) return;

    const err = parent.querySelector('.control-field__msg');
    if (!err) return;

    parent.classList.remove('is-invalid');
    parent.removeChild(err);
}

function inputErrorTemplate(msg) {
    return `
        <p class="control-field__msg">${msg}</p>
    `;
}

export function initFormValidation(form, instantMode) {
    const inputs = [...form.querySelectorAll('[data-required]')];

    inputs.forEach((el) => {
        el.addEventListener('focus', () => removeInputError(el));
    });

    if(instantMode) {
        inputs.forEach((el) => {
            el.addEventListener('blur', () => {
                const isValidInput = validate(el);
                if (!isValidInput) {
                    showInputError(el);
                }
            })
        });
    }
}

export function isFormValid(form, showErrors = true) {
    const inputs = [...form.querySelectorAll('[data-required]')];

    const isValidForm = inputs.every(el => {
        const isValidInput = validate(el);
        if (showErrors && !isValidInput) {
            showInputError(el);
        }
        return isValidInput;
    });

    return isValidForm;
}