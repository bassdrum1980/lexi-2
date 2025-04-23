import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { isTokenExpired } from '../../../utils/auth';
import {
  MOCK_CURRENT_DATE,
  MOCK_CURRENT_TIMESTAMP_SEC,
  MOCK_FUTURE_TIMESTAMP_SEC,
  MOCK_PAST_TIMESTAMP_SEC,
} from './setup';
import { FAKE_TOKEN } from '../../mocks/data/auth';

// --- Mock Dependencies ---
vi.mock('jwt-decode');
// Get typed mock function reference
const mockedJwtDecode = vi.mocked(jwtDecode);

describe('isTokenExpired', () => {
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
      const token = FAKE_TOKEN;

      // Arrange: Set up the mock to return a future expiration time
      const futureExpSeconds = MOCK_FUTURE_TIMESTAMP_SEC; // Expires in 1 hour
      mockedJwtDecode.mockReturnValue({ exp: futureExpSeconds } as JwtPayload);

      // Act
      const result = isTokenExpired(token);

      // Assert
      expect(result).toBe(false);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return false for a token that expires now', () => {
      const token = FAKE_TOKEN;

      // Arrange: Set up the mock to return expiration exactly matching Date.now()
      // The condition is `exp * 1000 < Date.now()`, so if equal, it's not expired yet.
      const exactExpSeconds = MOCK_CURRENT_TIMESTAMP_SEC;
      mockedJwtDecode.mockReturnValue({ exp: exactExpSeconds } as JwtPayload);

      // Act
      const result = isTokenExpired(token);

      // Assert
      expect(result).toBe(false);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });
  });

  describe('when the token is invalid', () => {
    it('should return true for a token that has already expired', () => {
      const token = FAKE_TOKEN;

      // Arrange: Set up the mock to return a past expiration time
      const pastExpSeconds = MOCK_PAST_TIMESTAMP_SEC; // Expired 1 hour ago
      mockedJwtDecode.mockReturnValue({ exp: pastExpSeconds } as JwtPayload);

      // Act
      const result = isTokenExpired(token);

      // Assert
      expect(result).toBe(true);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return true if the token payload does not contain an "exp" claim', () => {
      const token = FAKE_TOKEN;

      // Arrange: Mock returns a payload without 'exp'
      mockedJwtDecode.mockReturnValue({
        iat: MOCK_CURRENT_TIMESTAMP_SEC,
      } as JwtPayload);

      // Act
      const result = isTokenExpired(token);

      // Assert
      expect(result).toBe(true);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return true if jwtDecode throws an error (e.g., invalid token format)', () => {
      const token = FAKE_TOKEN;

      // Arrange: Set up the mock to throw an error
      const decodeError = new Error('Invalid token specified');
      mockedJwtDecode.mockImplementation(() => {
        throw decodeError;
      });

      // Act
      const result = isTokenExpired(token);

      // Assert
      expect(result).toBe(true);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });
  });
});
