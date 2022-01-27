import { sendForm } from '../services/api.service'
import floatLabel from './floatLabel';

export default function initConstructor() {

if(document.querySelector('.ssc')) {

    const typeSetts = document.querySelector('input[name="swimsuit-type"]:checked');
    const zipperSetts = document.querySelector('input[name="zipper"]:checked');
    const collarSetts = document.querySelector('input[name="collar"]:checked');

    const defaultConstructorSettings = {
        step: 0,
        steps: 5,
        type: typeSetts.value,
        typeTranslated: typeSetts.dataset.label,
        zipper: zipperSetts.value,
        zipperTranslated: zipperSetts.dataset.label,
        collar: collarSetts.value,
        collarTranslated: collarSetts.dataset.label,
        defaultType: 'model-twoo-piece-sleeveless',
        defaultColor: 'color-default',
        previews: [],
        ajaxUrl: '/calculator/add_order',
        sizes: {},
        userInfo: {}
    }

    let swimsuitConstructor = readSessionStorage() || defaultConstructorSettings;

    function submitSection(e) {
        e.preventDefault();
        const step = swimsuitConstructor.step;

        if (step < 3 && this.classList.contains(`step-ssc_step-${step + 1}`)) {

            return showNextStep();

        } else if (step == 3 && this.classList.contains(`step-ssc_step-${step + 1}`)) {

            const inputs = [...this.querySelectorAll('.form-calculator__control-field input')]
            inputs.forEach(input => {
                swimsuitConstructor.sizes[input.name] = input.value;
            })
            return showNextStep();

        } else if (step == 4) {
            const inputs = [...this.querySelectorAll('.form-calculator__control-field input, .form-calculator__control-field textarea')]

            inputs.forEach(input => {
                swimsuitConstructor.userInfo[input.name] = input.value;
            });

            const data = new FormData();
            data.append('json', JSON.stringify(swimsuitConstructor));

            fetch(swimsuitConstructor.ajaxUrl, {
                method: 'POST',
                body: data
            })
            .then(function(res) { return res.text() })
            .then(function(data) {
                console.log(data);
                showFinalStep();
                resetConstructor();
            })
            
            showFinalStep();
            resetConstructor();
        } else {
            return;
        }
    }

    function togglePatternsVisibility() {
        [...document.querySelectorAll('.tabs-calculator__tab.active')].forEach(modal => {
            modal.classList.remove('active');
        });
        
        document.getElementById(this.value).classList.add('active');
        updateColorScheme.call(document.getElementById(this.value).querySelector('input:checked'));
    }

    function toggleTooltip(e) {
        if (e.type == 'mouseover') {
            document.querySelector(this.dataset.target).classList.add('ssc-tooltip--visible');
        } else if (e.type == 'mouseout') {
            document.querySelector(this.dataset.target).classList.remove('ssc-tooltip--visible');
        }
    }

    function showModal() {
        const target = document.querySelector(this.dataset.target);

        target.classList.add('ssc-modal--visible');

        const targetId = target.getAttribute('id');

        if (targetId == 'swimsuit-color' || targetId == 'swimsuit-print') {
            updateColorScheme.call(target.querySelector('input:checked'));
        }
    }

    function hideModal() {
        document.querySelector(this.dataset.target).classList.remove('ssc-modal--visible');
    }

    function updateType() {
        const checked = document.querySelector('input[name="swimsuit-type"]:checked');
        const val = checked.value;
        const label = checked.dataset.label;
        const price = checked.dataset.price;

        swimsuitConstructor.type = val;
        swimsuitConstructor.typeTranslated = label;
        swimsuitConstructor.price = price;

        document.getElementById('ssc-type-trigger').value = label;
        document.getElementById('submit-text').innerHTML = "Заказать за " + price + " руб.";
        document.getElementById('total-text').innerHTML = price;

        updateModel();
        saveToSessionStorage();
    }

    function updateAdditionalOptions() {
        const val = this.value;
        const label = this.dataset.label;

        swimsuitConstructor[toCamelCase(this.name)] = val;
        swimsuitConstructor[toCamelCase(this.name + '-translated')] = label;

        saveToSessionStorage();
    }

    function updateColorScheme() {
        let schemeDir = this.name.replace(/^swimsuit-/, '');
        let altDir = schemeDir == 'color' ? 'print' : 'color';

        if (swimsuitConstructor[altDir]) swimsuitConstructor[altDir] = null;

        const value = this.id.replace(/^clr-/, '');

        swimsuitConstructor[schemeDir] = value;

        updateModel();

        if (schemeDir == 'color') {
            document.querySelector('.showcase-example_color').innerText = this.dataset.patternName;
            document.querySelector('.showcase-example_color').setAttribute('class', 'colors-ssc__showcase showcase-example showcase-example_color showcase-example_color-' + value);
            document.getElementById('ssc-color-trigger').value = this.dataset.patternName;
        } else if (schemeDir == 'print') {
            document.querySelector('.showcase-example_print').setAttribute('class', 'colors-ssc__showcase showcase-example showcase-example_print showcase-example_print-' + value)
            document.getElementById('ssc-print-trigger').value = this.dataset.patternName;
        }

        if (swimsuitConstructor.color || swimsuitConstructor.print) loadPreviews(this);

        saveToSessionStorage();

        floatLabel.init();
    }

    function goToStep(step) {
        swimsuitConstructor.step = step;
        updateSection();
    }

    function updateSection() {
        const step = swimsuitConstructor.step + 1;
        hidePrev(step);
        showNew(step);

        let pictureAction = '';

        if (step >= 4) pictureAction = 'add';
        else pictureAction = 'remove';

        // document.querySelector('.swimsuit-constructor__picture').classList[pictureAction]('swimsuit-constructor__picture--hidden-xs');

        if (step == 6) pictureAction = 'add';
        else pictureAction = 'remove';
        
        // document.querySelector('.swimsuit-constructor__picture').classList[pictureAction]('swimsuit-constructor__picture--hidden-all');

        togglePreviews();
        saveToSessionStorage();
    }

    function hidePrev(step) {
        const sections = document.querySelectorAll('.step-ssc');
        for (let i = 0, len = sections.length; i < len; i++) {
            sections[i].classList.remove('active');
        }
    }

    function showNew(step) {
        const newSection = document.querySelector('.step-ssc_step-' + step);
        newSection.classList.add('active');
        
        const firstFocusable = newSection.querySelector('input, button');
        if (firstFocusable) firstFocusable.focus();
    }

    function showNextStep() {
        if (swimsuitConstructor.step < 5) swimsuitConstructor.step++;
        updateSection();
    }

    function showPrevStep() {
        if (swimsuitConstructor.step > 0) swimsuitConstructor.step--;
        updateSection();
    }

    function showFinalStep() {
        document.querySelector('.ssc__content').style.display = 'none';
        document.querySelector('.message-calculator').classList.add('active');
    }

    function updatePreviews() {
        if (swimsuitConstructor.previews.length) {
            document.querySelector('.ssc__gallery').innerHTML = '';
        
            swimsuitConstructor.previews.forEach(addPreview);
        }
    }

    function togglePreviews() {
        let previewsAction = '';
        
        if ((swimsuitConstructor.step + 1) >= 3) {
            previewsAction = 'add';

        } else {
            previewsAction = 'remove';
        }

        document.querySelector('.ssc__gallery').classList[previewsAction]('ssc__gallery--visible');
    }

    function addPreview(src) {
        const urlMedium = "/frontend/img/swimsuit/photo/thumb/";
        const urlSmall = "/frontend/img/swimsuit/photo/thumbs/";
        
        document.querySelector('.ssc__gallery').insertAdjacentHTML('beforeend',
            `<a href="${urlMedium}${src}" class="ssc__image" style="background-image: url(${urlSmall}${src})">
                <svg>
                    <use xlink:href="#zoom"/>
                </svg>
            </a>`)
    }

    function updateModel() {
        const model = document.querySelector('.model');
        const classes = ['ssc__model','model'];

        if (swimsuitConstructor.type) {
            classes.push(`model-${swimsuitConstructor.type}`);
        } else {
            classes.push(`model-${swimsuitConstructor.defaultType}`);
        }

        if (swimsuitConstructor.print) {
            classes.push(`pattern pattern-${swimsuitConstructor.print}`);
        } else if (swimsuitConstructor.color) {
            classes.push(`color-${swimsuitConstructor.color}`);
        } else {
            classes.push(swimsuitConstructor.defaultColor);
        }

        model.className = classes.join(' ');
    }

    function setDefaults() {
        if (swimsuitConstructor.type) {
            for (let input of document.querySelectorAll('input[name="swimsuit-type"]')) {
                if (input.value == swimsuitConstructor.type)
                    input.checked = true;
            }
        }

        if (swimsuitConstructor.zipper) {
            for (let input of document.querySelectorAll('input[name="zipper"]')) {
                if (input.value == swimsuitConstructor.zipper)
                    input.checked = true;
            }
        }

        if (swimsuitConstructor.collar) {
            for (let input of document.querySelectorAll('input[name="collar"]')) {
                if (input.value == swimsuitConstructor.collar)
                    input.checked = true;
            }
        }

        if (swimsuitConstructor.print) {
            document.getElementById('clr-' + swimsuitConstructor.print).checked = true;
        } else if (swimsuitConstructor.color) {
            document.getElementById('clr-' + swimsuitConstructor.color).checked = true;
        }
    }

    function loadPreviews(tgt) {
        const type = tgt.dataset.type;
        const id = tgt.dataset[type + 'Id'];

        const formData = new FormData();
        formData.append('id', id);
        formData.append('type', type);

        sendForm('POST', '/calculator/view_photos', formData).then(rsp => {
            // console.log(type, id, rsp);
            swimsuitConstructor.previews = rsp;
            updatePreviews();
        })
    }


    function resetConstructor() {
        sessionStorage.swimsuitConstructor = null;
        
        for (let form of document.querySelectorAll('form.step-ssc')) {
            form.reset();
        }

        for (let input of document.querySelectorAll('.form-calculator__control-field input')) {
            input.value = '';
        }

        swimsuitConstructor = defaultConstructorSettings;
    }

    setDefaults();
    updateType();
    updateSection();
    updateModel();

    document.addEventListener('click', e => {    
        const prevStepTrigger = e.target.closest('.step-ssc__back');
        if (prevStepTrigger) showPrevStep();
    });
    
    document.addEventListener('change', e => {
        if (e.target.matches('input[name="swimsuit-type"]')) updateType();
        if (e.target.matches('input[name="zipper"], input[name="collar"], input[name="zipper-color"]')) updateAdditionalOptions.call(e.target);
        if (e.target.matches('input[name="swimsuit-color"], input[name="swimsuit-print"]')) updateColorScheme.call(e.target)
        if (e.target.matches('input[name="print-modal-control"]')) togglePatternsVisibility.call(e.target);
    })
    
    // document.addEventListener('input', e => {
    //     if (e.target.matches('.form-calculator__control-field input')) validateInput.call(e.target);
    // })
    
    document.addEventListener('submit', e => {
        if (!e.target.matches('.step-ssc')) return;
        submitSection.call(e.target, e);
    })

    togglePatternsVisibility.call(document.querySelector('input[name="print-modal-control"]:checked'));

    if (swimsuitConstructor.color) {
        updateColorScheme.call(document.getElementById('swimsuit-color').querySelector('input:checked'));
    } else if (swimsuitConstructor.print) {
        updateColorScheme.call(document.getElementById('swimsuit-print').querySelector('input:checked'));
    }

    // function validateInput() {
    //     this.setAttribute('value', this.value);
    
    //     if (this.dataset.maxChar) {
    //         getSiblings(this, '.ssc-section__input-counter').forEach(el => (el.innerText = this.value.length + '/100'));
    //     }
    // }
    
    function readSessionStorage() {
        const constData = sessionStorage.swimsuitConstructor;
        if (constData) return JSON.parse(constData);
        else return false;
    }
    
    function saveToSessionStorage() {
        sessionStorage.swimsuitConstructor = JSON.stringify(swimsuitConstructor);
    }
    
    function toCamelCase(str) {
        return str.split('-').map((item, idx) => idx == 0 ? item : item[0].toUpperCase() + item.slice(1)).join('');
    }
}

}