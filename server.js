// @ts-ignore
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();
const PORT_NO = process.env.PORT || 4004;

app.listen(PORT_NO, () => {
  console.log("Server started and listening on port: ".concat(PORT_NO));
});
