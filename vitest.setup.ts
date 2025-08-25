import '@testing-library/jest-dom';

vi.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/', push: vi.fn(), prefetch: vi.fn() }),
}));
