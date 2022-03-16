module.exports = {
	modulePaths: ['./src'],
	moduleFileExtensions: ['js', 'jsx', 'node'],
	moduleDirectories: ['node_modules'],
	moduleNameMapper: {
		'^@assets(.*)$': '<rootDir>/src/assets$1',
		'^@constants(.*)$': '<rootDir>/src/constants$1',
		'^@components(.*)$': '<rootDir>/src/components$1',
		'^@icons(.*)$': '<rootDir>/src/icons/icons$1',
		'^@colors(.*)$': '<rootDir>/src/constants/colors$1',
		'^@ducks(.*)$': '<rootDir>/src/ducks$1',
		'^@routes(.*)$': '<rootDir>/src/constants/routes$1',
		'^@utils(.*)$': '<rootDir>/src/utils$1',
		'^@api(.*)$': '<rootDir>/src/api$1',
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ogg)$':
			'<rootDir>/__mocks__/fileMock.js',
	},
	snapshotSerializers: [
		'enzyme-to-json/serializer',
	],
	transform: {
		'^.+\\.(js|jsx)$': 'babel-jest',
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ogg)$':
			'<rootDir>/fileTransformer.js',
	},
	testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
	reporters: ['default'],
	collectCoverageFrom: [
		'<rootDir>/src/**/*.{js,jsx}',
	],
	coverageReporters: ['json', 'lcov', 'text', 'clover'],
	coverageDirectory: 'coverage',
	setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
};
