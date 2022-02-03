import { sendForm } from '../services/api.service';
import { initFormValidation, isFormValid } from '../helpers/validate';

export default function initCabinet() {
    const form = document.querySelector('.form-cabinet');

    if(form) {
        initFormValidation(form, true);

        let state = 'readonly';

        const submit = form.querySelector('.form-cabinet__submit');

        const fields = [...document.querySelectorAll('.form-cabinet__control-field')];

        if(submit) {
            form.addEventListener('input', () => {
                submit.disabled = false;
            });
        }

        form.addEventListener('click', (e) => {
            const edit = e.target.closest('.form-cabinet__edit');
            const cancel = e.target.closest('.form-cabinet__cancel');
            const editField = e.target.closest('.form-cabinet__edit-field');

            if(edit) {
                setState('edit');
            }
            if(cancel) {
                setState('readonly');
            }
            if(editField) {
                e.preventDefault();
                if(editField.classList.contains('active')) {
                    editField.type = 'button'
                    onSubmit();
                } else {
                    editField.type = 'submit'
                }
                editField.classList.toggle('active');
                const field = editField.previousElementSibling;
                toggleField(field);
            }
        });

        function onSubmit() {
            if(!isFormValid(form)) return;

            const formData = new FormData(form);

            sendForm('POST', '/cabinet/personal_data_save', formData);
        }

        function enableField(field) {
            field.classList.remove('control-field_read-only');
            field.querySelector('.control-field__control').disabled = false;
        }

        function disableField(field) {
            field.classList.add('control-field_read-only');
            field.querySelector('.control-field__control').disabled = true;
        }

        function toggleField(field) {
            if(field.classList.contains('control-field_read-only')) {
                enableField(field);
            } else {
                disableField(field);
            }
        }

        function setState(stateProp) {
            state = stateProp;

            switch (stateProp) {
                case 'readonly':
                    fields.forEach((field) => {
                        disableField(field);
                    });
                    form.classList.remove('edit');
                    form.classList.add('readonly');
                    break;
                case 'edit':
                    fields.forEach((field) => {
                        enableField(field);
                    });
                    form.classList.remove('readonly');
                    form.classList.add('edit');
                default:
                    break;
            }
        }
    }
}