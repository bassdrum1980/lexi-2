import { renderHook } from '@testing-library/react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  Mock,
  MockInstance,
} from 'vitest';
import { useAppDispatch } from '../../../app/hooks';
import useSyncToken from '../../../hooks/useSyncToken';
import { setToken } from '../../../features/auth/authSlice';

// --- Mock Dependencies ---
vi.mock('../../../app/hooks', () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock('../../../features/auth/authSlice', () => ({
  setToken: vi.fn(),
}));

describe('useSyncToken', () => {
  // Create mock functions for easier access in tests
  let mockUseDispatch: Mock;
  const mockDispatch = vi.fn();

  // Initialize spies for addEventListener and removeEventListener
  let addEventListenerSpy: MockInstance<typeof window.addEventListener>;
  let removeEventListenerSpy: MockInstance<typeof window.removeEventListener>;

  beforeEach(() => {
    // Assign mocks from the mocked modules
    mockUseDispatch = useAppDispatch as unknown as Mock;
    mockUseDispatch.mockReturnValue(mockDispatch);

    // Assign spies
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.clearAllMocks();
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should add a storage event listener on mount', () => {
    // Act
    renderHook(() => useSyncToken());

    // Assert
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'storage',
      expect.any(Function)
    );
  });

  it('should remove the storage event listener on unmount', () => {
    // Arrange
    const { unmount } = renderHook(() => useSyncToken());

    // Act
    unmount();

    // Assert
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'storage',
      expect.any(Function)
    );
  });

  it('should dispatch setToken when storage event with key "token" is triggered', () => {
    // Arrange
    const token = 'new-token';
    const storageEvent = new StorageEvent('storage', {
      key: 'token',
      newValue: token,
    });
    const { unmount } = renderHook(() => useSyncToken());

    // Act
    window.dispatchEvent(storageEvent);

    // Assert
    expect(setToken).toHaveBeenCalledWith(token);
    expect(mockDispatch).toHaveBeenCalledWith(setToken(token));

    // Cleanup
    unmount();
  });
});
