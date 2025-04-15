import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import useTokenValidation from '../useTokenValidation';
import { getTokenExpirationTimeMs } from '../../utils/auth';
import { signOut } from '../../features/auth/authSlice';

// --- Mock Dependencies ---
vi.mock('../../app/hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../utils/auth', () => ({
  getTokenExpirationTimeMs: vi.fn(),
}));

vi.mock('../../features/auth/authSlice', () => ({
  signOut: vi.fn(),
  selectToken: vi.fn(),
}));

describe('useTokenValidation', () => {
  // Create mock functions for easier access in tests
  let mockUseSelector: Mock;
  let mockGetTokenExpirationTimeMs: Mock;
  let mockSignOut: Mock;
  let mockUseDispatch: Mock;
  const mockDispatch = vi.fn();

  beforeEach(() => {
    // Assign mocks from the mocked modules
    mockUseSelector = useAppSelector as unknown as Mock;
    mockGetTokenExpirationTimeMs = getTokenExpirationTimeMs as unknown as Mock;
    mockSignOut = signOut as unknown as Mock;
    mockUseDispatch = useAppDispatch as unknown as Mock;
    mockUseDispatch.mockReturnValue(mockDispatch);

    // Enable fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should do nothing if no token is present', () => {
    // Arrange:
    mockUseSelector.mockReturnValue(null);

    // Act: Render the hook
    renderHook(() => useTokenValidation());

    // Assert
    expect(mockGetTokenExpirationTimeMs).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch signOut immediately if token is already expired', () => {
    // Arrange
    const token = 'expired-token';
    mockUseSelector.mockReturnValue(token);
    mockGetTokenExpirationTimeMs.mockReturnValue(0); // Indicate expiration (<= 0)
    mockSignOut.mockReturnValue({ type: 'auth/signOut' });

    // Act
    renderHook(() => useTokenValidation());

    // Assert
    expect(getTokenExpirationTimeMs).toHaveBeenCalledWith(token);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(mockSignOut());
  });

  it('should schedule signOut with setTimeout if token is valid', () => {
    // Arrange
    const token = 'valid-token';
    const remainingTimeMs = 5000;
    mockUseSelector.mockReturnValue(token);
    mockGetTokenExpirationTimeMs.mockReturnValue(remainingTimeMs);

    // Act
    vi.useFakeTimers(); // Use fake timers to control setTimeout
    renderHook(() => useTokenValidation());

    // Assert
    expect(mockGetTokenExpirationTimeMs).toHaveBeenCalledWith(token);
    expect(mockDispatch).not.toHaveBeenCalled(); // Not dispatched yet

    // Act
    vi.advanceTimersByTime(remainingTimeMs); // Fast-forward time to trigger the timeout

    // Assert
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(mockSignOut());
  });

  it('should clear timeout on unmount', () => {
    // Arrange
    const token = 'valid-token-unmount';
    const remainingTimeMs = 5000;
    mockUseSelector.mockReturnValue(token);
    mockGetTokenExpirationTimeMs.mockReturnValue(remainingTimeMs);
    const { unmount } = renderHook(() => useTokenValidation());

    // Act
    vi.useFakeTimers(); // Use fake timers to control setTimeout
    unmount();
    vi.advanceTimersByTime(remainingTimeMs); // Fast-forward time to trigger the timeout

    // Assert
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
