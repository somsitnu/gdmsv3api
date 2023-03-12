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
      filepdf: "https://pdf-lib.js.org/assets/with_update_sections.pdf",
      created_at: "2022-05-30 16:20:55"
    }
    // Register Stamp in Book
    await PdfService.stampRegister(getfile);


    res.status(200).send("แปลงไฟล์สำเร็จ");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});





