const { execSync } = require("child_process");
const { CONTAINER_NAME } = require("./testDbConfig");

module.exports = async () => {
  try {
    execSync(`docker rm -f ${CONTAINER_NAME}`, { stdio: "ignore" });
    console.log(`\n[integration] stopped ${CONTAINER_NAME}`);
  } catch (_err) {
    // already gone
  }
};
