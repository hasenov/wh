import { sendForm } from '../services/api.service';

export default function initCertificate() {
    const certForm = document.forms['formCertificate'];

    if(certForm) {
        certForm.addEventListener('submit', function(e) {
            e.preventDefault();
        
            sendForm('POST', '/certificate/addcertificate', new FormData(this))
                .then(rsp => {
                    document.querySelector('.certificate__message').classList.add('active');
                    certForm.style.display = 'none';
                })
        })
    }
}