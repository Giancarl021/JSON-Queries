import './lib';
import './sass/style.scss';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js';
import * as storage from './storage';
import engines from './engines';
import defaultJson from './placeholders/json';

let cmi, cmo, engine;

function init() {
    const options = {
        mode: 'application/json',
        theme: 'dracula',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        dragDrop: true,
        matchBrackets: true,
        indentUnit: 4,
        autoCloseTags: true,
        autoCloseBrackets: true,
        extraKeys: {
            'Ctrl-Space': 'autocomplete'
        }
    };

    cmi = CodeMirror.fromTextArea(document.getElementById('in'), options);
    cmo = CodeMirror.fromTextArea(document.getElementById('out'), {
        ...options,
        extraKeys: undefined,
        dragDrop: false,
        readOnly: true
    });

    const $select = document.getElementById('query-languages');
    const $input = document.getElementById('query');
    const $button = document.getElementById('run');

    updateEngine();
    changePlaceholder($input, engine.placeholder);
    setDefaultJSON();

    $select.insertAdjacentHTML('beforeend', engines.reduce((acc, eng) => `${acc}\n<option value="${eng.name}" ${eng.name === engine.name ? 'selected' : ''}>${eng.label}</option>`, ''));
    $select.onchange = event => {
        setSelectedEngine(event.target.value);
        updateEngine();
        changeValue($input, '');
        changePlaceholder($input, engine.placeholder);        
    };

    $button.onclick = () => query($input, $select);
}

function setSelectedEngine(value) {
    storage.set('selected-engine', value);
}

function changePlaceholder($input, value) {
    $input.placeholder = value;
}

function changeValue($input, value) {
    $input.value = value;
}

function query($input, $select) {
    const option = $select.value;
    const { value, placeholder } = $input;
    let input, output;

    try {
        input = JSON.parse(cmi.getValue());
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid JSON',
            text: err.message
        });
        return;
    }

    const engine = engines.find(e => e.name === option);
    if (!engine) return;

    try {
        if (!value && placeholder) {
            $input.value = placeholder;
        }
        output = engine.engine(input, value || placeholder);
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Query',
            text: err.message
        });
        return;
    }

    cmo.setValue(JSON.stringify(output, null, 4));
}

function updateEngine() {
    const selected = storage.get('selected-engine');
    if (!selected) {
        engine = engines[0];
        return;
    }

    engine = engines.find(engine => engine.name === selected);
}

function setDefaultJSON() {
    cmi.setValue(
        JSON.stringify(defaultJson, null, 4)
    );
}

document.addEventListener('DOMContentLoaded', init);