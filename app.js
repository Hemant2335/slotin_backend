import express from "express";
import cookieParser from "cookie-parser";
import router from"../slotin_backend/src/routes/user.js"
const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser())

app.use("/user",router);

export { app }