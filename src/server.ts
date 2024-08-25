import app from "./app";
import { AppDataSource } from "./config/data-source";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((e) => console.log("Database connection error: ", e));
