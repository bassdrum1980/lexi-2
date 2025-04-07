import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { isTokenExpired } from '../../auth';

// Init module mock
vi.mock('jwt-decode');
// Get typed mock function reference
const mockedJwtDecode = vi.mocked(jwtDecode);

describe('isTokenExpired', () => {
  // Set consistent "current time"
  const MOCK_CURRENT_DATE = new Date(2025, 3, 4, 18, 0, 0);
  const MOCK_CURRENT_TIMESTAMP_MS = MOCK_CURRENT_DATE.getTime();
  const MOCK_CURRENT_TIMESTAMP_SEC = MOCK_CURRENT_TIMESTAMP_MS / 1000;

  beforeEach(() => {
    // Use fake timers before each test
    vi.useFakeTimers();
    // Set the "current" time for Date.now()
    vi.setSystemTime(MOCK_CURRENT_DATE);
    // Reset any previous mock implementations/return values
    mockedJwtDecode.mockReset();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  describe('when the token is valid', () => {
    it('should return false for a token that expires in the future', () => {
      // Arrange: Set up the mock to return a future expiration time
      const futureExpSeconds = MOCK_CURRENT_TIMESTAMP_SEC + 3600; // Expires in 1 hour
      mockedJwtDecode.mockReturnValue({ exp: futureExpSeconds } as JwtPayload);
      const token = 'valid-token-not-expired';

      // Act
      const result = isTokenExpired(token);

      // Assert
      expect(result).toBe(false);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return false for a token that expires now', () => {
      // Arrange: Set up the mock to return expiration exactly matching Date.now()
      // The condition is `exp * 1000 < Date.now()`, so if equal, it's not expired yet.
      const exactExpSeconds = MOCK_CURRENT_TIMESTAMP_SEC;
      mockedJwtDecode.mockReturnValue({ exp: exactExpSeconds } as JwtPayload);
      const token = 'valid-token-expires-now';

      // Act
      const result = isTokenExpired(token);

      // Assert
      expect(result).toBe(false);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });
  });

  describe('when the token is invalid', () => {
    it('should return true for a token that has already expired', () => {
      // Arrange: Set up the mock to return a past expiration time
      const pastExpSeconds = MOCK_CURRENT_TIMESTAMP_SEC - 3600; // Expired 1 hour ago
      mockedJwtDecode.mockReturnValue({ exp: pastExpSeconds } as JwtPayload);
      const token = 'valid-token-expired';

      // Act
      const result = isTokenExpired(token);

      // Assert
      expect(result).toBe(true);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return true if the token payload does not contain an "exp" claim', () => {
      // Arrange: Mock returns a payload without 'exp'
      mockedJwtDecode.mockReturnValue({
        iat: MOCK_CURRENT_TIMESTAMP_SEC,
      } as JwtPayload);
      const token = 'valid-token-no-exp';

      // Act
      const result = isTokenExpired(token);

      // Assert
      expect(result).toBe(true);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return true if jwtDecode throws an error (e.g., invalid token format)', () => {
      // Arrange: Set up the mock to throw an error
      const decodeError = new Error('Invalid token specified');
      mockedJwtDecode.mockImplementation(() => {
        throw decodeError;
      });
      const token = 'invalid-token-string';

      // Act
      const result = isTokenExpired(token);

      // Assert
      expect(result).toBe(true);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });
  });
});
