import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { validateToken } from '../../auth';
import {
  MOCK_CURRENT_DATE,
  MOCK_FUTURE_TIMESTAMP_SEC,
  MOCK_PAST_TIMESTAMP_SEC,
} from './setup';

// Init module mock
vi.mock('jwt-decode');
// Get typed mock function reference
const mockedJwtDecode = vi.mocked(jwtDecode);

describe('validateToken', () => {
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
    it('should return the token when it is not expired', () => {
      // Arrange
      const futureExpSeconds = MOCK_FUTURE_TIMESTAMP_SEC; // Expires in 1 hour
      mockedJwtDecode.mockReturnValue({
        exp: futureExpSeconds,
      } as JwtPayload);

      const validToken = 'valid-not-expired-token';

      // Act
      const result = validateToken(validToken);

      // Assert
      expect(result).toBe(validToken); // Uncommented this assertion
      expect(mockedJwtDecode).toHaveBeenCalledWith(validToken);
    });
  });

  describe('when the token is not valid', () => {
    it('should return null when the token is expired', () => {
      // Arrange
      const pastExpSeconds = MOCK_PAST_TIMESTAMP_SEC; // Expired 1 hour ago
      mockedJwtDecode.mockReturnValue({
        exp: pastExpSeconds,
      } as JwtPayload);
      const token = 'valid-token-expired';

      // Act
      const result = validateToken(token);

      // Assert
      expect(result).toBeNull();
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return null when the token is null', () => {
      // Arrange
      const nullToken = null;

      // Act
      const result = validateToken(nullToken);

      // Assert
      expect(result).toBeNull();
      expect(mockedJwtDecode).not.toHaveBeenCalled();
    });
  });
});
