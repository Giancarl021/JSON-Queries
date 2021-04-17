import './lib';
import './sass/style.scss';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import engines from './engines';

let cm;

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

    cm = CodeMirror.fromTextArea(document.getElementById('in'), options);
    CodeMirror.fromTextArea(document.getElementById('out'), {
        ...options,
        extraKeys: undefined,
        dragDrop: false,
        readOnly: true
    });

    const $select = document.getElementById('query-languages');
    const $input = document.getElementById('query');
    const $button = document.getElementById('run');

    $select.insertAdjacentHTML('beforeend', engines.reduce((acc, engine) => `${acc}\n<option value="${engine.name}">${engine.label}</option>`, ''));

    $button.onclick = () => query($input, $select);
}

function query($input, $select) {
    const option = $select.value;
    const { value } = $input;
    let input;

    try {
        input = JSON.parse(cm.getValue());
    } catch (err) {
        Swal.fire({
            title: 'Invalid JSON',
            text: err.message
        });
        return;
    }

    const engine = engines.find(e => e.name === option);
    if (!engine) return;

    const out = engine.engine(input, value);

    console.log(out);
}

document.addEventListener('DOMContentLoaded', init);