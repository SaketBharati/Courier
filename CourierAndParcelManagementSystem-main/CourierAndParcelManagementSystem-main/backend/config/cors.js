import cors from "cors";

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://courier-y93t.onrender.com",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Origin:", origin);

    // Allow requests with no Origin (Postman, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
};

export default cors(corsOptions);