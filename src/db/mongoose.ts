import mongoose from "mongoose";

//? Importing a library to display colorful messages
import chalk from "chalk";

mongoose.connect(
  "mongodb://localhost:27017/souq_replica",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) {
      console.log(
        chalk.bgWhite.bold.red(
          `There is an error connecting to the database the error is ${error}`
        )
      );
    }
  }
);
