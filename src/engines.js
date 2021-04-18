import jmespath from 'jmespath';
import jsonpath from 'jsonpath';

export default [
    {
        label: 'JMES Path',
        name: 'jmespath',
        engine: jmespath.search.bind(jmespath)
    },
    {
        label: 'JSON Path',
        name: 'jsonpath',
        engine: jsonpath.query.bind(jsonpath)
    }
];