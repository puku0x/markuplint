const { parse } = require('../lib/');

describe('Tags', () => {
	it('liquid-block', () => {
		expect(parse('{% any %}').nodeList[0].nodeName).toBe('#ps:liquid-block');
	});

	it('liquid-output', () => {
		expect(parse('{{ any }}').nodeList[0].nodeName).toBe('#ps:liquid-output');
	});
});
