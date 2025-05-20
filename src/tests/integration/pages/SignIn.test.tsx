import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../../routes/AppRoutes.tsx';
import { getTokenExpirationTimeMs, isTokenValid } from '../../../utils/auth.ts';
import { renderWithProviders } from '../../test-utils.tsx';
import { handlers } from '../../mocks/handlers.tsx';
import { FAKE_TOKEN } from '../../mocks/data/auth.ts';

// --- Mock Dependencies ---
vi.mock(import('../../../utils/auth.ts'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getTokenExpirationTimeMs: vi.fn(),
    isTokenValid: vi.fn(),
  };
});

// Assign mocks from the mocked modules
let mockGetTokenExpirationTimeMs: Mock;
let mockIsTokenValid: Mock;

// Setting up the server
const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => {
  server.listen({
    onUnhandledRequest: ({ url, method }) => {
      console.warn(`[MSW] Unhandled ${method} request to ${url}`);
    },
  });
});

beforeEach(() => {
  mockGetTokenExpirationTimeMs = getTokenExpirationTimeMs as unknown as Mock;
  mockIsTokenValid = isTokenValid as unknown as Mock;
});

afterEach(() => {
  vi.clearAllMocks();
  // Reset any runtime request handlers we may add during the tests
  server.resetHandlers();
});

// Disable API mocking after the tests are done.
afterAll(() => server.close());

// --- Tests ---
it('renders home page after signing in', async () => {
  const remainingTimeMs = 100000;
  const initialToken = null;
  const initialPath = '/';
  const expectedPage = 'home-page';
  const email = import.meta.env.VITE_TESTING_USERNAME;
  const password = import.meta.env.VITE_TESTING_PASSWORD;
  const user = userEvent.setup();

  // Arrange
  // Set token expiration so useTokenValidation hook will not trigger immediately upon signing in
  mockGetTokenExpirationTimeMs.mockReturnValue(remainingTimeMs);
  // Make the isTokenValid function to return true
  mockIsTokenValid.mockReturnValue(true);
  renderWithProviders(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppRoutes />
    </MemoryRouter>,
    {
      // Provide authenticated state
      preloadedState: {
        auth: {
          user: null,
          token: initialToken,
        },
      },
    }
  );

  // Act
  const emailField = screen.getByTestId<HTMLInputElement>('signin-email');
  const passwordField = screen.getByTestId<HTMLInputElement>('signin-password');
  await user.type(emailField, email);
  await user.type(passwordField, password);
  await user.click(screen.getByTestId('signin-submit'));

  // Asert
  // The user must be redirected to the home page
  expect(await screen.findByTestId(expectedPage)).toBeInTheDocument();
  // And just to make sure that mock functions were called with proper arguments
  expect(mockGetTokenExpirationTimeMs).toHaveBeenCalledWith(FAKE_TOKEN);
  expect(mockIsTokenValid).toHaveBeenCalledWith(FAKE_TOKEN);
});
