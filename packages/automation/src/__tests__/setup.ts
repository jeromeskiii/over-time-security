import { beforeAll, afterAll, vi } from 'vitest';

// Mock environment variables
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/ots_test';
process.env.REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379';

// Mock BullMQ queues for integration tests
vi.mock('../jobs/queues', () => ({
  getAllQueues: () => new Map(),
}));

beforeAll(async () => {
  // Setup test database connection if needed
});

afterAll(async () => {
  // Cleanup
});
