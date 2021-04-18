import jmespath from 'jmespath';
import jsonpath from 'jsonpath';
import alasql from 'alasql';

export default [
    {
        label: 'JMES Path',
        name: 'jmespath',
        placeholder: '[*].a',
        engine: jmespath.search.bind(jmespath)
    },
    {
        label: 'JSON Path',
        name: 'jsonpath',
        placeholder: '$..a',
        engine: jsonpath.query.bind(jsonpath)
    },
    {
        label: 'Ala SQL',
        name: 'alasql',
        placeholder: 'SELECT a, sum(b) FROM ? GROUP BY a',
        engine: (input, query) => alasql(query, [ input ])
    }
];