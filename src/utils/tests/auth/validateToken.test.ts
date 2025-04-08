import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateToken, isTokenExpired } from '../../auth';
import { MOCK_CURRENT_DATE } from './setup';

vi.mock('../../auth', async () => {
  const actual = await vi.importActual('../../auth');
  return {
    ...actual,
    isTokenExpired: vi.fn(),
  };
});

const mockedIsTokenExpired = vi.mocked(isTokenExpired);

describe('validateToken', () => {
  beforeEach(() => {
    // Use fake timers before each test
    vi.useFakeTimers();
    // Set the "current" time for Date.now()
    vi.setSystemTime(MOCK_CURRENT_DATE);
    // Reset any previous mock implementations/return values
    mockedIsTokenExpired.mockReset();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  describe('when the token is valid', () => {
    it('should return the token when it is not expired', () => {
      // Arrange
      const validToken = 'valid-not-expired-token';
      mockedIsTokenExpired.mockReturnValue(false);

      // Act
      const result = validateToken(validToken);

      // Assert
      expect(result).toBe(validToken); // Uncommented this assertion
      expect(mockedIsTokenExpired).toHaveBeenCalledWith(validToken);
    });
  });
});
