import type { RootNode } from '@astrojs/compiler';

import { ParserError } from '@markuplint/parser-utils';
import { parseTemplate } from 'astro-eslint-parser';

// eslint-disable-next-line import/no-extraneous-dependencies
export type {
	RootNode,
	ElementNode,
	CustomElementNode,
	ComponentNode,
	FragmentNode,
	AttributeNode,
	Node,
} from '@astrojs/compiler';

export function astroParse(code: string): RootNode {
	const { result } = parseTemplate(code);

	if (result.diagnostics[0]) {
		const error = result.diagnostics[0];
		throw new ParserError(error.text, {
			line: error.location.line,
			col: error.location.column,
		});
	}

	return result.ast;
}
