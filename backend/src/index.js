const express = require("express");
const cors = require("cors");
const expensesRouter = require("./routes/expenses");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/expenses", expensesRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
