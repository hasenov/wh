import datepicker from 'js-datepicker';

export default function initDatepicker() {
    const datepickerElement = document.querySelector('.datepicker__input');
    
    if(datepickerElement) {
        const datepickerBtn = document.querySelector('.datepicker__btn');
        const datepickerInput = document.querySelector('.datepicker__input');
        const datepickerOutput = document.querySelector('.certificate-date');
        const datepickerInstantInput = document.querySelector('.datepicker__instant .radio__input'); 
        const datepickerInstantContent = document.querySelector('.datepicker__instant .radio__label');
        const datepickerInstantContentValue = datepickerInstantContent.hasAttribute('data-output-text') ? datepickerInstantContent.getAttribute('data-output-text') : datepickerInstantContent.textContent;
        let datepickerValue = '';
    
        const picker = datepicker(datepickerElement, {
            customDays: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
            customMonths: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
            disableYearOverlay: true,
            alwaysShow: true,
            formatter: (input, date, instance) => {
                const value = date.toLocaleDateString();
                input.value = value;
            },
            onSelect: (instance, date) => {
                if(datepickerInput && datepickerOutput) {
                    datepickerValue = datepickerInput.value;
                    datepickerInstantInput.checked = false;
                }
            }
        });
    
        datepickerBtn.addEventListener('click', function(e) {
            datepickerOutput.value = datepickerValue;
        });
        datepickerBtn.addEventListener('touchend', function(e) {
            datepickerOutput.value = datepickerValue;
        });
    
        datepickerInstantInput.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                datepickerValue = datepickerInstantContentValue;
                picker.setDate();
            } else {
                datepickerValue = '';
            }
        })
    }
}