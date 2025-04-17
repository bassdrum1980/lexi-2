import { Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { act, screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils.tsx';
import { AppRoutes } from '../../routes/AppRoutes.tsx';
import { signinURL } from '../../routes/index.ts';
import { getTokenExpirationTimeMs } from '../../utils/auth.ts';

describe('when the user is unauthenticated', () => {
  it('renders Sign in page for unauthenticated user at root', async () => {
    const token = null;
    const initialPath = `/${signinURL}`;
    const expectedPage = 'signin-page';

    // Arrange
    renderWithProviders(
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRoutes />
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            user: null,
            token,
          },
        },
      }
    );

    // Act
    const page = screen.getByTestId(expectedPage);

    // Assert
    expect(page).toBeInTheDocument();
  });

  it('renders Sign in page when navigating directly to signin', async () => {
    const token = null;
    const initialPath = `/${signinURL}`;
    const expectedPage = 'signin-page';

    // Arrange
    renderWithProviders(
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRoutes />
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            user: null,
            token,
          },
        },
      }
    );

    // Act
    const page = screen.getByTestId(expectedPage);

    // Assert
    expect(page).toBeInTheDocument();
  });
});

describe('when the user is authenticated', () => {
  // --- Mock Dependencies ---
  vi.mock(import('../../utils/auth.ts'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      getTokenExpirationTimeMs: vi.fn(),
    };
  });

  // Assign mocks from the mocked modules
  let mockGetTokenExpirationTimeMs: Mock;

  beforeEach(() => {
    // Mock the getTokenExpirationTimeMs function to return a positive value
    mockGetTokenExpirationTimeMs = getTokenExpirationTimeMs as unknown as Mock;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Home page for authenticated user at root', async () => {
    const remainingTimeMs = 100000;
    const token = 'fake-token';
    const initialPath = '/';
    const expectedPage = 'home-page';

    // Arrange
    mockGetTokenExpirationTimeMs.mockReturnValue(remainingTimeMs); // Set token expiration === 100 seconds
    renderWithProviders(
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRoutes />
      </MemoryRouter>,
      {
        // Provide authenticated state
        preloadedState: {
          auth: {
            user: null,
            token,
          },
        },
      }
    );

    // Act
    const page = screen.getByTestId(expectedPage);

    // Assert
    expect(page).toBeInTheDocument();
    expect(mockGetTokenExpirationTimeMs).toBeCalledWith(token);
  });

  it('redirects unmatched path to fallback route (Home page) for authenticated user', () => {
    const remainingTimeMs = 100000;
    const token = 'fake-token';
    const initialPath = '/unmatched';
    const expectedPage = 'home-page';

    // Arrange
    mockGetTokenExpirationTimeMs.mockReturnValue(remainingTimeMs); // Set token expiration in 100 seconds
    renderWithProviders(
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRoutes />
      </MemoryRouter>,
      {
        // Provide authenticated state
        preloadedState: {
          auth: {
            user: null,
            token,
          },
        },
      }
    );

    // Act
    const page = screen.getByTestId(expectedPage);

    // Assert
    expect(page).toBeInTheDocument();
    expect(mockGetTokenExpirationTimeMs).toBeCalledWith(token);
  });

  it('redirects user to sign in page when token is expired', async () => {
    const remainingTimeMs = 100000;
    const token = 'fake-token';
    const initialPath = '/';
    const expectedPage = 'signin-page';

    // Arrange
    mockGetTokenExpirationTimeMs.mockReturnValue(remainingTimeMs); // Set token expiration in 100 seconds
    vi.useFakeTimers();
    renderWithProviders(
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRoutes />
      </MemoryRouter>,
      {
        // Provide authenticated state
        preloadedState: {
          auth: {
            user: null,
            token,
          },
        },
      }
    );

    // Act
    act(() => {
      vi.advanceTimersByTime(remainingTimeMs); // Fast-forward time to trigger the timeout
    });

    const page = screen.getByTestId(expectedPage);

    // Assert
    expect(page).toBeInTheDocument();
    expect(mockGetTokenExpirationTimeMs).toBeCalledWith(token);

    // Clean up
    vi.useRealTimers();
  });
});
