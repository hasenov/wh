import { sendForm } from '../services/api.service';
import { initFormValidation, isFormValid } from '../helpers/validate';

export default function initCertificate() {
    const certForm = document.forms['formCertificate'];

    if(certForm) {
        initFormValidation(certForm, true);

        certForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if(!isFormValid(certForm)) return;
        
            sendForm('POST', '/certificate/addcertificate', new FormData(this))
                .then(rsp => {
                    document.querySelector('.certificate__message').classList.add('active');
                    certForm.style.display = 'none';
                })
        })
    }
}