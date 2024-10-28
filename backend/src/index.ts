const express = require("express");
import session from "express-session";
import MongoStore from "connect-mongo";

import userRoutes from "./routes/user";

import { readEnv } from "./util/envReader";
import { MongoClient } from "mongodb";
import createHttpError from "http-errors";
import mongoose from "mongoose";

const environment = readEnv();

mongoose.connect(environment.MongoConnectionUri).then(() => {
    console.log("Connected to MongoDB");

    const app = express();

    app.listen(environment.Port, () => {
        console.log(`Server Started, Listening on port ${environment.Port}...`);

        app.use(express.json());

        app.use(
            session({
                secret: environment.SessionSecret,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    maxAge: 120 * 24 * 60 * 60 * 10000, // 120 days
                },
                rolling: true,
                store: MongoStore.create({
                    mongoUrl: environment.MongoConnectionUri,
                }),
            })
        );

        app.use("/api/user", userRoutes)

        app.use((req:any, res:any, next:any) => {
            //console.log(req.url);

            next(createHttpError(404, "Endpoint not found"));
        });
    });
});
