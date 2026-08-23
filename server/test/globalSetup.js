const { execSync } = require("child_process");
const mysql = require("mysql2/promise");
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
    `docker run -d --name ${CONTAINER_NAME} -p ${DB_PORT}:3306 ` +
      `-e MYSQL_ROOT_PASSWORD=${DB_PASSWORD} -e MYSQL_DATABASE=${DB_NAME} mysql:8.0`,
    { stdio: "inherit" },
  );

  // MySQL's entrypoint briefly accepts connections on a *temporary* server
  // while it creates MYSQL_DATABASE, then restarts into the real server -
  // connecting successfully during that window doesn't mean it's actually
  // ready. Require two successful connections to the real database, a few
  // seconds apart, before declaring it ready.
  const tryConnect = async () => {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    await conn.end();
  };

  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    try {
      await tryConnect();
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await tryConnect();
      console.log("[integration] MySQL is ready");
      return;
    } catch (_err) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  throw new Error("Test MySQL container did not become ready in time");
};
