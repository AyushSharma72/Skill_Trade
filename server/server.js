const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectDb = require("./dbconfig");
const UserRoutes = require("./routes/UserRoutes");
const WorkerRoutes = require("./routes/WorkerRoutes");
const RequestRoutes = require("./routes/RequestRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const ServiceRoutes = require("./routes/ServiceRouter");
const cron = require("node-cron");
const app = express();
const https = require("https");


//parse the data
app.use(express.json());

//use cors
const allowedOrigins = [
  "http://localhost:3000",
  "https://skill-trade-next-15.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);  
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],

}));

//config dotenv
dotenv.config();

// connect database
ConnectDb();

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/workers", WorkerRoutes);
app.use("/api/v1/request", RequestRoutes);
app.use("/api/v1/services", ServiceRoutes);

// use with middleware
app.use("/api/v1/admin", AdminRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Hello from SkillTrade backend!");
});


cron.schedule("* * * * *", () => {
  https.get(process.env.RENDER_URL, (res) => {
    console.log(`[${new Date().toISOString()}] Ping successful:`, res.statusCode);
  }).on("error", (err) => {
    console.error(`[${new Date().toISOString()}] Ping failed:`, err.message);
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("server running on", PORT);
});
