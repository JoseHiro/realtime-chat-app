const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

// 最小限の設定
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
