const express = require("express");
const cors = require("cors");
const utils = require("./utils");
const config = require("./config");

const port = config.PORT_NO;

console.log(port);

// create a new express application
const app = express();
app.use(cors());
app.use(express.json());

// add Routes
const userRoutes = require("./routes/user");

app.use("/user", userRoutes);

app.listen(port, () => console.log(`App listening on port ${port}!`));
