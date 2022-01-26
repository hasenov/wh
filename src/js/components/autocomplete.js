export var ac = {
    // (A) PROPERTIES
    instances: [], // autocomplete instances
    open: null, // instance that is currently open

    // (B) ATTACH AUTOCOMPLETE TO INPUT FIELD
    //  target : target field
    //  data : suggestion data (array), or url (string)
    //  post : optional, extra data to send to server
    //  delay : optional, delay before suggestion, default 500ms
    //  min : optional, minimum characters to fire suggestion, default 2
    //  select : optional, function to call on selecting an option
    attach: (options) => {
        // (B1) NEW AUTOCOMPLETE INSTANCE
        ac.instances.push({
            target: options.target,
            data: options.data,
            post: options.post ? options.post : null,
            delay: options.delay ? options.delay : 500,
            min: options.min ? options.min : 2,
            select: options.select ? options.select : null,
            suggest: document.createElement("div"), // html suggestion box
            timer: null // autosuggest timer
        });

        // (B2) ATTACH AUTOCOMPLETE HTML
        let id = ac.instances.length - 1,
            instance = ac.instances[id],
            parent = instance.target.parentElement,
            wrapper = document.createElement("div");

        instance.target.setAttribute("autocomplete", "off");
        parent.insertBefore(wrapper, instance.target);
        wrapper.classList.add("acWrap");
        wrapper.appendChild(instance.target);
        wrapper.appendChild(instance.suggest);
        let classes = ['acSuggest', 'custom-select__dropdown']
        instance.suggest.classList.add(...classes);

        // (B3) KEY PRESS LISTENER
        instance.target.addEventListener("keyup", (evt) => {
            // (B3-1) CLEAR OLD TIMER & SUGGESTION BOX
            if (instance.timer != null) {
                window.clearTimeout(instance.timer);
            }
            instance.suggest.innerHTML = "";
            instance.suggest.style.display = "none";

            // (B3-2) CREATE NEW TIMER - FETCH DATA FROM SERVER OR STRING
            if (instance.target.value.length >= instance.min) {
                if (typeof instance.data == "string") {
                    instance.timer = setTimeout(() => {
                        ac.fetch(id);
                    }, instance.delay);
                } else {
                    instance.timer = setTimeout(() => {
                        ac.filter(id);
                    }, instance.delay);
                }
            }
        });
    },

    // (C) DRAW SUGGESTIONS FROM ARRAY
    filter: (id) => {
        // (C1) GET INSTANCE + DATA
        let instance = ac.instances[id],
            search = instance.target.value.toLowerCase(),
            multi = typeof instance.data[0] == "object",
            results = [];

        // (C2) FILTER APPLICABLE SUGGESTIONS
        for (let i of instance.data) {
            let entry = multi ? i.D : i;
            if (entry.toLowerCase().indexOf(search) != -1) {
                results.push(i);
            }
        }

        // (C3) DRAW SUGGESTIONS
        ac.draw(id, results.length == 0 ? null : results);
    },

    // (D) AJAX FETCH SUGGESTIONS FROM SERVER
    fetch: (id) => {
        // (D1) INSTANCE & FORM DATA
        let instance = ac.instances[id]
        let data = instance.post
        data.query = instance.target.value;

        // (D2) FETCH
        fetch(instance.data, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((res) => {
            if (res.status != 200) {
                throw new Error("Bad Server Response");
            }
            return res.json();
        })
        .then((res) => {
            ac.draw(id, res.suggestions.map((item) => item.value));
            // return res.suggestions.map((item) => item.value)
        })
        .catch((err) => {
            console.error(err);
        });

    },

    // (E) DRAW AUTOSUGGESTION
    draw: (id, results) => {
        // (E1) GET INSTANCE
        let instance = ac.instances[id];
        ac.open = id;

        // (E2) DRAW RESULTS
        if (results == null) {
            ac.close();
        } else {
            instance.suggest.innerHTML = "";
            let multi = typeof results[0] == "object",
                list = document.createElement("ul"),
                row, entry;
            list.classList.add('custom-select__options')
            for (let i of results) {
                row = document.createElement("li");
                row.classList.add('custom-select__option');
                row.innerHTML = multi ? i.D : i;
                if (multi) {
                    entry = {
                        ...i
                    };
                    delete entry.D;
                    row.dataset.multi = JSON.stringify(entry);
                }
                row.onclick = function() {
                    ac.select(id, this);
                };
                list.appendChild(row);
            }
            instance.suggest.appendChild(list);
            instance.suggest.style.display = "block";
        }
    },

    // (F) ON SELECTING A SUGGESTION
    select: (id, el) => {
        // (F1) SET VALUES
        let instance = ac.instances[id];
        instance.target.value = el.innerHTML;
        if (el.dataset.multi !== undefined) {
            var multi = JSON.parse(el.dataset.multi);
            for (let i in multi) {
                document.getElementById(i).value = multi[i];
            }
        }

        // (F2) CALL ON SELECT - IF DEFINED
        if (instance.select != null) {
            instance.select(el.innerHTML, multi ? multi : null);
        }

        // (F3) CASE CLOSED
        ac.close();
    },

    // (G) CLOSE AUTOCOMPLETE
    close: () => {
        if (ac.open != null) {
            let instance = ac.instances[ac.open];
            instance.suggest.innerHTML = "";
            instance.suggest.style.display = "none";
            ac.open = null;
        }
    },

    // (H) CLOSE AUTOCOMPLETE IF USER CLICKS ANYWHERE OUTSIDE
    checkclose: (evt) => {
        if (ac.open != null) {
            let instance = ac.instances[ac.open];
            if (instance.target.contains(evt.target) == false &&
                instance.suggest.contains(evt.target) == false) {
                ac.close();
            }
        }
    }
};
document.addEventListener("click", ac.checkclose);