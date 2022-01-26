class InputMask {
    constructor(options) {
        this.el = this.getElement(options.selector);
        if (!this.el) return console.log('Р§С‚Рѕ-С‚Рѕ РЅРµ С‚Р°Рє СЃ СЃРµР»РµРєС‚РѕСЂРѕРј');
        this.layout = options.layout || '+7(___)___-__-__';
        this.maskreg = this.getRegexp();
        this.setListeners();
    }

    getRegexp() {
        const entityMap = {
            '_': '\\d',
            '(': '\\(',
            ')': '\\)',
            '+': '\\+',
            "s": '\\s',
        };

        return String(this.layout).replace(/[_\(\)\+\s]/g, s => (entityMap[s]))
    }

    mask(e) {
        const _this = e.target
        let matrix = this.layout,
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = _this.value.replace(/\D/g, "")

        if (def.length >= val.length) val = def;
        _this.value = matrix.replace(/./g, function (a) {
            return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
        })

        if (e.type == "blur") {
            const regexp = new RegExp(this.maskreg);
            if (!regexp.test(_this.value)) _this.value = "";
        } else {
            this.setCursorPosition(_this.value.length, _this);
        }
    }

    setCursorPosition(pos, elem) {
        elem.focus();
        if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
        else if (elem.createTextRange) {
            const range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd("character", pos);
            range.moveStart("character", pos);
            range.select();
        }
    }

    setListeners() {
        const handler = this.mask.bind(this)
        const events = ['input', 'focus', 'blur']
        events.forEach(event => {
            this.el.addEventListener(event, handler, false);
        })
    }

    getElement(selector) {
        if (selector === undefined) return false;
        if (isElement(selector)) return selector;
        if (typeof selector == 'string') {
            var el = document.querySelector(selector);
            if (isElement(el)) return el;
        }
        return false;
    }

}

export default function initInputMasking(selector, root = document) {
    const inputs = root.querySelectorAll(selector)
    for (let input of inputs) {

        new InputMask({
            selector: input,
            layout: input.dataset.mask
        })
    }
}

const isElement = element => element instanceof Element || element instanceof HTMLDocument