import rateLimit from "express-rate-limit";
// aplikuj este helmet a loggy vo Winston
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
});

export default rateLimiter;
