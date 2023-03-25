"use strict";
/**
 * Required External Modules and Interfaces
 */
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
exports.pdfRouter = void 0;
const express_1 = __importDefault(require("express"));
const PdfService = __importStar(require("./pdf.service"));
/**
 * Router Definition
 */
exports.pdfRouter = express_1.default.Router();
/**
 * Controller Definitions
 */
// GET items
exports.pdfRouter.get("/stamp-register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getfile = {
            courtname: "ศาลจังหวัดอุบลราชธานี",
            keep_on: "266",
            keep_date: "2022-05-30",
            filepdf: "http://localhost/gdms/storage/12022/06/30.BPN1YmXj3gbIfuKrBrZVcvpkebx0v3aSFM9uYgFU.pdf",
            created_at: "2022-05-30 16:20:55",
            created_at_time: "16:20:55",
            owner: "สมสิทธิ์",
        };
        // Register Stamp in Book
        yield PdfService.stampRegister(getfile);
        res.status(200).send("แปลงไฟล์สำเร็จ");
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
// pdfRouter.get("/stamp-kumsang/:id", async (req: Request, res: Response) => {
exports.pdfRouter.post("/re-stamp-kumsang", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.body);
    const getd = req.body;
    try {
        // Register Stamp in Book
        yield PdfService.reStampKumsang(getd);
        res.status(200).send("แปลงไฟล์สำเร็จ");
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
