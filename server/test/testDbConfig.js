// Shared connection details for the throwaway Postgres container used by
// integration tests. Both globalSetup/globalTeardown (which start and stop
// the container) and the test files (which connect to it) import this, so
// there's no need to pass values across the process boundary Jest's
// globalSetup runs in.
module.exports = {
  DB_HOST: "127.0.0.1",
  DB_PORT: "5433",
  DB_USER: "postgres",
  DB_PASSWORD: "test_root_pw",
  DB_NAME: "lexstate_test",
  CONTAINER_NAME: "lexstateco-test-postgres",
};
