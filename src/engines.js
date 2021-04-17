import jmespath from 'jmespath';
import jsonpath from 'jsonpath';
import jsonquery from 'json-query';

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
    },
    {
        label: 'JSON Query',
        name: 'jsonquery',
        engine: obj => jsonquery(JSON.stringify(obj))
    }
];