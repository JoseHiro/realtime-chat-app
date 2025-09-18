import '@testing-library/jest-dom'

// Next.js Router の基本モック
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      pathname: '/',
    }
  },
}))
