import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/UserModel";

import bcrypt from "bcrypt";

// Util

function ensureLength(str: string, min:number, max:number, valueName:string) {
    if (str.length < min){
        throw createHttpError(500, valueName + " must be at least " + min + " characters long")
    }

    if (str.length > max){
        throw createHttpError(500, valueName + " cannot be more than " + max + " characters long")
    }
}

export const getUser : RequestHandler = async (req, res, next) => {
    try {
        if (req.params.userId) {

        } else {
            const authenticatedUserId = req.session.userId;

            if (!authenticatedUserId) {
                throw createHttpError(401, "Authentication failed");
            }

            const user = await UserModel.findById(authenticatedUserId)
                .select("+email")
                .exec();

            res.status(200).json(user);
        }
    } catch (error) {
        next(error);
    }
    
}

interface SignupBody {
    email: string,
    username: string,
    password: string
}

export const signupUser : RequestHandler<unknown, unknown, SignupBody, unknown> = async (req, res, next) => {
    try {
        const existingUser = await UserModel.find({email: req.body.email});

        if (existingUser){
            throw createHttpError(500, "Account with that email already exists");
        }

        ensureLength(req.body.username, 2, 40, "Username");
        ensureLength(req.body.password, 4, 80, "Password");
        
        if (!req.body.email.match("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")){
            throw createHttpError(500, "Invalid email address provided");
        }

        const passwordHashed = await bcrypt.hash(req.body.password, 10);

        const newUser = await UserModel.create({email: req.body.email, username: req.body.username, password: passwordHashed})

        req.session.userId = newUser._id
        res.status(200).json(newUser);
    } catch (error) {
        next(error);
    }
}

interface LoginBody {
    identifier: string, // username OR email
    password: string
}

export const loginUser : RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    try {
        let existingUser = await UserModel.findOne({email: req.body.identifier}).select("+password");

        if (!existingUser){
            existingUser = await UserModel.findOne({username: req.body.identifier}).select("+password");

            if (!existingUser){
                throw createHttpError(500, "Invalid username or email");
            }
        }
        
        if (await bcrypt.compare(req.body.password, existingUser.password)){
            req.session.userId = existingUser._id
            res.status(200).json(existingUser);
        }else{
            throw createHttpError(401, "Invalid credentials")
        }
        
    } catch (error) {
        next(error);
    }
}