const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoute = require("./sources/routes/authRoutes");
const userRoute = require("./sources/routes/userRoute");

const { PORT, DBURL } = require("./config/default.json");

const app = express();

app.use(express.json());

// app.all('*', (req, res, next)=>{
//     next(new AppError(`Con't find this path on this server`, 404))
// })

// app.use(globalErrorHandler)

mongoose
  .connect(DBURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) =>
    app.listen(PORT, () => console.log("DB connected port " + PORT))
  )
  .catch((error) => console.log(error));

app.use(authRoute);
app.use(userRoute);
