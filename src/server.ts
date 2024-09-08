import app from "./app";
import { AppDataSource } from "./database/config/data-source";
import { logger } from "./logger/logger";

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected");
    app.listen(3000, () => logger.info("Server is running on port 3000"));
  })
  .catch((e) => logger.info("Database connection error: ", e));
