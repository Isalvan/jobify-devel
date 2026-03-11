export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  globals: {
    'import.meta': {
      env: {
        VITE_API_URL: 'http://localhost:8000/api'
      }
    }
  }
};
