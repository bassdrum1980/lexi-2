import { Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../test-utils.tsx';
import { AppRoutes } from '../../routes/AppRoutes.tsx';
import { signinURL } from '../../routes/index.ts';
import { getTokenExpirationTimeMs } from '../../utils/auth.ts';

// Mocking the getTokenExpirationTimeMs function so that the useTokenValidation hook
// won't immediately sign out the user when the token is expired.
vi.mock(import('../../utils/auth.ts'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getTokenExpirationTimeMs: vi.fn(),
  };
});

describe('when the user is unauthenticated', () => {
  test('renders Sign in page for unauthenticated user at root', async () => {
    // Arrange
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
          },
        },
      }
    );

    // Act
    const heading = await screen.findByRole('heading', { name: /Sign in/i });

    // Assert
    expect(heading).toBeInTheDocument();
  });

  test('renders Sign in page when navigating directly to signin', async () => {
    // Arrange
    renderWithProviders(
      <MemoryRouter initialEntries={[`/${signinURL}`]}>
        <AppRoutes />
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
          },
        },
      }
    );

    // Act
    const heading = await screen.findByRole('heading', { name: /Sign in/i });

    // Assert
    expect(heading).toBeInTheDocument();
  });
});

describe('when the user is authenticated', () => {
  // Assign mocks from the mocked modules
  let mockGetTokenExpirationTimeMs: Mock;

  beforeEach(() => {
    // Mock the getTokenExpirationTimeMs function to return a positive value
    mockGetTokenExpirationTimeMs = getTokenExpirationTimeMs as unknown as Mock;
    mockGetTokenExpirationTimeMs.mockReturnValue(100000); // 100 seconds
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Example test for authenticated user accessing home
  test('renders Home page for authenticated user at root', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
      {
        // Provide authenticated state
        preloadedState: {
          auth: {
            user: null,
            token: 'fake-token',
          },
        },
      }
    );

    // Act
    const heading = await screen.findByRole('heading', { name: /Home/i });

    // Assert
    expect(heading).toBeInTheDocument();
  });
});
