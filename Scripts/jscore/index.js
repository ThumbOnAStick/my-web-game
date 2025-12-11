/**
 * @fileoverview Core module exports
 * Re-exports all core functionality for easy importing
 */

export * from './interfaces.js';
export * from './servicecontainer.js';

// Testing utilities (import separately to avoid bundling in production)
// import { createTestContext, assert } from './jscore/testing/testutils.js';
// import * as Mocks from './jscore/testing/mocks.js';
