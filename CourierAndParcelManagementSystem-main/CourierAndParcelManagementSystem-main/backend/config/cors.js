import cors from "cors";

const allowedOrigins = [
    process.env.CLIENT_URL
];

const corsOptions = {
  origin: (origin, callback) => {
    //? Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

export default cors(corsOptions);
