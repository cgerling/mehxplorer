'use strict';

const helper = {};

{
    helper.bindData = bindData;
    helper.valueOf = parseExpression;

    const regex = {
        allCurlyBrackets: /{{([^}]+)}}/g,
        onlyCurlyBrackets: /({{)|(}})/g,
        brackets: /(\[)|(\])/g
    };

    function bindData(element, data) {
        let pureExpressions = getPureExpression(element.innerHTML);

        const expValue = {};
        pureExpressions.forEach(function mapExps(exp) {
            let times = 1;
            if (expValue[exp]) times = expValue[exp].times + 1;

            expValue[exp] = {
                exp: parseExpression(exp, data),
                times
            };
        });

        bindDataOnElement(element, expValue);
    }

    function parseExpression(exp = '', ref) {
        let parts = exp.replace(regex.brackets, '.').split('.')
            .filter(part => part !== '');

        let value = ref;
        parts.forEach(function getValue(part) {
            value = value[part];
        });

        return value;
    }

    function getPureExpression(text = '') {
        let matches = text.trim().match(regex.allCurlyBrackets) || [];
        return matches.map(matcher => purifyExpression(matcher));
    }

    function purifyExpression(text = '') {
        return text.trim().replace(regex.onlyCurlyBrackets, '');
    }

    function bindDataOnElement(element, data) {
        let text = purifyExpression(element.innerHTML);

        for (let exp in data) {
            let expression = exp;
            if (data[exp].times > 1) expression = new RegExp(exp, 'g');

            text = text.replace(expression, data[exp].exp);
        }

        element.innerHTML = text;
    }
}