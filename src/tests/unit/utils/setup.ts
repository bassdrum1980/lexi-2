export const MOCK_CURRENT_DATE = new Date(2025, 3, 4, 18, 0, 0);
export const MOCK_CURRENT_TIMESTAMP_MS = MOCK_CURRENT_DATE.getTime();
export const MOCK_CURRENT_TIMESTAMP_SEC = MOCK_CURRENT_TIMESTAMP_MS / 1000;
export const MOCK_FUTURE_TIMESTAMP_SEC = MOCK_CURRENT_TIMESTAMP_SEC + 3600; // 1 hour in the future
export const MOCK_PAST_TIMESTAMP_SEC = MOCK_CURRENT_TIMESTAMP_SEC - 3600; // 1 hour in the past
export const ONE_HOUR_IN_MS = 3600 * 1000; // 1 hour in milliseconds
