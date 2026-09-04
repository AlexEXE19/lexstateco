const { execSync } = require("child_process");
const { Client } = require("pg");
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  CONTAINER_NAME,
} = require("./testDbConfig");

module.exports = async () => {
  // Clean up any leftover container from a previous crashed/interrupted run.
  try {
    execSync(`docker rm -f ${CONTAINER_NAME}`, { stdio: "ignore" });
  } catch (_err) {
    // nothing to remove
  }

  console.log(`\n[integration] starting ${CONTAINER_NAME} on port ${DB_PORT}...`);
  execSync(
    `docker run -d --name ${CONTAINER_NAME} -p ${DB_PORT}:5432 ` +
      `-e POSTGRES_PASSWORD=${DB_PASSWORD} -e POSTGRES_DB=${DB_NAME} postgres:16`,
    { stdio: "inherit" },
  );

  const tryConnect = async () => {
    const client = new Client({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    await client.connect();
    await client.end();
  };

  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    try {
      await tryConnect();
      console.log("[integration] Postgres is ready");
      return;
    } catch (_err) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  throw new Error("Test Postgres container did not become ready in time");
};
