import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { getTokenExpirationTimeMs } from '../../auth';
import {
  MOCK_CURRENT_DATE,
  MOCK_CURRENT_TIMESTAMP_SEC,
  MOCK_FUTURE_TIMESTAMP_SEC,
  MOCK_PAST_TIMESTAMP_SEC,
} from './setup';

// Init module mock
vi.mock('jwt-decode');
// Get typed mock function reference
const mockedJwtDecode = vi.mocked(jwtDecode);

describe('getTokenExpirationTimeMs', () => {
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
    it('should return the correct time remaining in milliseconds for a token that expires in the future', () => {
      // Arrange: Set up the mock to return a future expiration time
      const oneHourInSeconds = 3600;
      const futureExpSeconds = MOCK_FUTURE_TIMESTAMP_SEC; // Expires in 1 hour
      mockedJwtDecode.mockReturnValue({ exp: futureExpSeconds } as JwtPayload);
      const token = 'valid-token-not-expired';

      // Act
      const result = getTokenExpirationTimeMs(token);

      // Assert
      expect(result).toBe(oneHourInSeconds * 1000); // Should be 1 hour in milliseconds
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return 0 for a token that expires exactly now', () => {
      // Arrange: Set up the mock to return expiration exactly matching current time
      const exactExpSeconds = MOCK_CURRENT_TIMESTAMP_SEC;
      mockedJwtDecode.mockReturnValue({ exp: exactExpSeconds } as JwtPayload);
      const token = 'valid-token-expires-now';

      // Act
      const result = getTokenExpirationTimeMs(token);

      // Assert
      expect(result).toBe(0);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });
  });

  describe('when the token is invalid', () => {
    it('should return a negative value for a token that has already expired', () => {
      // Arrange: Set up the mock to return a past expiration time
      const oneHourInSeconds = 3600;
      const pastExpSeconds = MOCK_PAST_TIMESTAMP_SEC; // Expired 1 hour ago
      mockedJwtDecode.mockReturnValue({ exp: pastExpSeconds } as JwtPayload);
      const token = 'valid-token-expired';

      // Act
      const result = getTokenExpirationTimeMs(token);

      // Assert
      expect(result).toBe(-oneHourInSeconds * 1000); // Should be -1 hour in milliseconds
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return 0 if the token payload does not contain an "exp" claim', () => {
      // Arrange: Mock returns a payload without 'exp'
      mockedJwtDecode.mockReturnValue({
        iat: MOCK_CURRENT_TIMESTAMP_SEC,
      } as JwtPayload);
      const token = 'valid-token-no-exp';

      // Act
      const result = getTokenExpirationTimeMs(token);

      // Assert
      expect(result).toBe(0);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return 0 if jwtDecode throws an error (e.g., invalid token format)', () => {
      // Arrange: Set up the mock to throw an error
      const decodeError = new Error('Invalid token specified');
      mockedJwtDecode.mockImplementation(() => {
        throw decodeError;
      });
      const token = 'invalid-token-string';

      // Act
      const result = getTokenExpirationTimeMs(token);

      // Assert
      expect(result).toBe(0);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });
  });
});
