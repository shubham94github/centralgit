const plugins = [
	require('@babel/plugin-transform-runtime'),
	require('@babel/plugin-proposal-async-generator-functions'),
	require('@babel/plugin-syntax-jsx'),
];

if (process.env.NODE_ENV === 'development') plugins.push('react-refresh/babel');

module.exports = {
	presets: [
		'@babel/preset-env',
		['@babel/preset-react', { runtime: 'automatic' }],
	],
	plugins,
	env: {
		test: {
			plugins: plugins.concat(['syntax-dynamic-import']),
		},
	},
};
