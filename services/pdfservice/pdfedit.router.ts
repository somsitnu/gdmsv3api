/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as PdfService from "./pdf.service";

/**
 * Router Definition
 */

export const pdfRouter = express.Router();

/**
 * Controller Definitions
 */

// GET items

pdfRouter.get("/pdf", async (req: Request, res: Response) => {
  try {
    const getfile = {
      courtname : "ศาลจังหวัดอุบลราชธานี",  
      keep_on: "266",
      keep_date: "2022-05-30",
      filepdf: "http://localhost/gdms/storage/12022/06/30.BPN1YmXj3gbIfuKrBrZVcvpkebx0v3aSFM9uYgFU.pdf",
      created_at: "2022-05-30 16:20:55"
      created_at_time: "16:20:55"
      owner : "สมสิทธิ์"
    }
    // Register Stamp in Book
    await PdfService.stampRegister(getfile);


    res.status(200).send("แปลงไฟล์สำเร็จ");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

pdfRouter.get("/pdfstamp", async (req: Request, res: Response) => {
  try {
    const getfile = {
      courtname : "ศาลจังหวัดอุบลราชธานี",  
      keep_on: "266",
      keep_date: "2022-05-30",
      filepdf: "http://localhost/gdms/storage/12022/06/30.BPN1YmXj3gbIfuKrBrZVcvpkebx0v3aSFM9uYgFU.pdf",
      created_at: "2022-05-30 16:20:55"
      created_at_time: "16:20:55"
      owner : "สมสิทธิ์"
    }
    // Register Stamp in Book
    await PdfService.stampKumsang(getfile);


    res.status(200).send("แปลงไฟล์สำเร็จ");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});





