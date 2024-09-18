"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpload = exports.imagedisplay = exports.login = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = require("../model/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = require("cloudinary");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const dbEmail = yield userModel_1.User.findOne({ email: email });
        if (dbEmail) {
            res.status(500).json({ message: "Email already exists!" });
        }
        else {
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%55');
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = new userModel_1.User({ username, email, password: hashedPassword });
            yield newUser.save();
            res.status(201).json({ message: 'Your account has been successfully created. Please log in now.', username, email });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userData = yield userModel_1.User.findOne({ email: email });
        if (userData) {
            const passMatch = yield bcrypt_1.default.compare(password, userData.password);
            if (passMatch) {
                if (userData.isAdmin) {
                    const token = jsonwebtoken_1.default.sign({ email: userData.email, userId: userData._id, isAdmin: true }, 'mysecretkey', { expiresIn: "75h" });
                    res.status(201).json({ userId: userData._id, email: userData.email, token: token, isAdmin: true, username: userData.username });
                }
                else {
                    const token = jsonwebtoken_1.default.sign({ email: userData.email, userId: userData._id, isAdmin: false }, 'mysecretkey', { expiresIn: "75h" });
                    res.status(201).json({ userId: userData._id, email: userData.email, token: token, isAdmin: false, username: userData.username });
                }
            }
            else {
                res.status(500).json({ message: "Incorrect Credentials!!!!" });
            }
        }
        else {
            res.status(500).json({ message: "Incorrect Credentials!" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.login = login;
const imagedisplay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        console.log(userId + '+++++===');
        const userData = yield userModel_1.User.findOne({ _id: userId });
        if (userData) {
            const userName = userData.username;
            const imgFileName = userData.image;
            res.json({ userName, url: imgFileName });
        }
        else {
            res.status(500).json({ message: "User Not Found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.imagedisplay = imagedisplay;
const profileUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.query.userId;
        console.log(userId);
        console.log(process.env.CLOUDINARY_API_KEY, '()()()()()()()()()()');
        if (req.file) {
            const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            const uploadOptions = {
                transformation: {
                    width: 300,
                    height: 300,
                    crop: 'fill'
                }
            };
            console.log(filePath);
            const uploadedImage = yield cloudinary_1.v2.uploader.upload(filePath, uploadOptions);
            const userData = yield userModel_1.User.findById(userId);
            if (userData) {
                console.log('5678u9i0o');
                userData.image = uploadedImage.secure_url;
                yield userData.save();
                res.json({ imagePath: uploadedImage.secure_url });
            }
            else {
                res.status(500).json({ message: "User Not found Or Internal Server Error" });
            }
        }
        else {
            res.status(500).json({ message: "Image Not found Try again" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.profileUpload = profileUpload;
