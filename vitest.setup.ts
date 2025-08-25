import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/', push: vi.fn(), prefetch: vi.fn() }),
}));
