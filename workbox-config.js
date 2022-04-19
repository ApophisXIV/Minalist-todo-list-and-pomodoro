module.exports = {
	globDirectory: 'assets/',
	globPatterns: [
		'**/*.{css,png,jpg,ico,js}'
	],
	swDest: 'assets/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};