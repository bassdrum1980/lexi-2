import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { isTokenValid } from '../../../utils/auth';
import {
  MOCK_CURRENT_DATE,
  MOCK_FUTURE_TIMESTAMP_SEC,
  MOCK_PAST_TIMESTAMP_SEC,
} from './setup';
import { FAKE_TOKEN } from '../../mocks/data/auth';

// Init module mock
vi.mock('jwt-decode');
// Get typed mock function reference
const mockedJwtDecode = vi.mocked(jwtDecode);

describe('isTokenValid', () => {
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
    it('should return true when the token is not expired', () => {
      const token = FAKE_TOKEN;

      // Arrange
      const futureExpSeconds = MOCK_FUTURE_TIMESTAMP_SEC; // Expires in 1 hour
      mockedJwtDecode.mockReturnValue({
        exp: futureExpSeconds,
      } as JwtPayload);

      // Act
      const result = isTokenValid(token);

      // Assert
      expect(result).toBeTruthy();
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });
  });

  describe('when the token is not valid', () => {
    it('should return false when the token is expired', () => {
      const token = FAKE_TOKEN;

      // Arrange
      const pastExpSeconds = MOCK_PAST_TIMESTAMP_SEC; // Expired 1 hour ago
      mockedJwtDecode.mockReturnValue({
        exp: pastExpSeconds,
      } as JwtPayload);

      // Act
      const result = isTokenValid(token);

      // Assert
      expect(result).toBeFalsy();
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return false when the token is null', () => {
      // Arrange
      const nullToken = null;

      // Act
      const result = isTokenValid(nullToken);

      // Assert
      expect(result).toBeFalsy();
      expect(mockedJwtDecode).not.toHaveBeenCalled();
    });
  });
});
