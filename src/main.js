import './lib';
import './sass/style.scss';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js';
import * as storage from './storage';
import engines from './engines';

let cmi, cmo;

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

    const selected = storage.get('selected-engine');

    $select.insertAdjacentHTML('beforeend', engines.reduce((acc, engine) => `${acc}\n<option value="${engine.name}" ${engine.name === selected ? 'selected' : ''}>${engine.label}</option>`, ''));
    $select.onchange = event => setSelectedEngine(event.target.value);

    $button.onclick = () => query($input, $select);
}

function setSelectedEngine(value) {
    storage.set('selected-engine', value);
}

function query($input, $select) {
    const option = $select.value;
    const { value } = $input;
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
        output = engine.engine(input, value);
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

document.addEventListener('DOMContentLoaded', init);