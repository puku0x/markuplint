// @ts-nocheck

import fs from 'fs';
import path from 'path';

import { globalAttrs } from './global-attribute.data';

const defs = {};
const properties = {};
const select = {};
Object.keys(globalAttrs).forEach(key => {
	const _key = key.replace('#', '');
	const value = globalAttrs[key];
	defs[_key] = {
		type: 'string',
		enum: value.attrs,
	};
	properties[key] = {
		description: value.description,
		type: 'object',
		required: value.attrs,
		propertyNames: {
			$ref: `#/definitions/${_key}`,
		},
		patternProperties: {
			'.+': {
				$ref: './attributes.schema.json#/definitions/AttributeJSON',
			},
		},
	};
	switch (key) {
		case '#HTMLGlobalAttrs':
		case '#ARIAAttrs': {
			select[key] = {
				type: 'boolean',
			};
			break;
		}
		case '#GlobalEventAttrs':
		case '#DocumentElementEventAttrs': {
			select[key] = {
				oneOf: [
					{
						type: 'boolean',
					},
					{
						type: 'array',
						minItems: 0,
						uniqueItems: true,
						items: {
							$ref: `./global-attributes.schema.json#/definitions/${_key}`,
						},
					},
				],
			};
			break;
		}
		default: {
			select[key] = {
				type: 'array',
				minItems: 0,
				uniqueItems: true,
				items: {
					$ref: `./global-attributes.schema.json#/definitions/${_key}`,
				},
			};
		}
	}
});

fs.writeFileSync(
	path.resolve(__dirname, '..', 'schemas', 'global-attributes.schema.json'),
	JSON.stringify({
		definitions: {
			category: {
				type: 'string',
				enum: Object.keys(globalAttrs),
			},
			...defs,
		},
		type: 'object',
		additionalProperties: false,
		propertyNames: {
			$ref: '#/definitions/category',
		},
		required: Object.keys(globalAttrs),
		properties,
	}),
);

fs.writeFileSync(
	path.resolve(__dirname, '..', 'schemas', 'attributes.schema.json'),
	JSON.stringify({
		definitions: {
			AttributeName: {
				type: 'string',
				pattern: '^(?:(xml|xlink):)?[a-z][a-zA-Z0-9-]*$',
			},
			AttributeCondition: {
				oneOf: [
					{
						type: 'object',
						additionalProperties: false,
						required: ['ancestor'],
						properties: {
							ancestor: {
								$ref: '#/definitions/Selectors',
							},
						},
					},
					{
						type: 'object',
						additionalProperties: false,
						required: ['self'],
						properties: {
							self: {
								$ref: '#/definitions/Selectors',
							},
						},
					},
				],
			},
			Selectors: {
				oneOf: [
					{
						type: 'string',
					},
					{
						type: 'array',
						minItems: 2,
						items: {
							type: 'string',
						},
					},
				],
			},
			AttributeType: {
				$ref: '../../types/types.schema.json#/definitions/type',
			},
			AttributeJSON: {
				type: 'object',
				additionalProperties: false,
				required: ['ref'],
				minProperties: 2,
				properties: {
					_TODO_: { type: 'string' },
					ref: { type: 'string', format: 'uri' },
					type: {
						oneOf: [
							{
								$ref: '#/definitions/AttributeType',
							},
							{
								type: 'array',
								minItems: 1,
								uniqueItems: true,
								items: {
									$ref: '#/definitions/AttributeType',
								},
							},
						],
					},
					defaultValue: { type: 'string' },
					deprecated: { type: 'boolean' },
					required: {
						oneOf: [
							{
								type: 'boolean',
							},
							{
								$ref: '#/definitions/AttributeCondition',
							},
						],
					},
					requiredEither: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
					noUse: {
						type: 'boolean',
					},
					condition: {
						$ref: '#/definitions/AttributeCondition',
					},
					ineffective: {
						$ref: '#/definitions/Selectors',
					},
					animatable: {
						type: 'boolean',
					},
				},
			},
			GlobalAttributes: {
				type: 'object',
				additionalProperties: false,
				propertyNames: {
					type: 'string',
					enum: Object.keys(globalAttrs),
				},
				properties: {
					...select,
				},
			},
			Attributes: {
				type: 'object',
				additionalProperties: false,
				propertyNames: {
					$ref: '#/definitions/AttributeName',
				},
				patternProperties: {
					'.*': {
						$ref: '#/definitions/AttributeJSON',
					},
				},
			},
		},
		type: 'object',
		additionalProperties: false,
		required: ['tag', 'ref', 'attributes'],
		properties: {
			tag: { type: 'string' },
			ref: { type: 'string', format: 'uri' },
			global: {
				$ref: '#/definitions/GlobalAttributes',
			},
			attributes: {
				$ref: '#/definitions/Attributes',
			},
		},
	}),
);
