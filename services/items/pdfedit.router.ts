/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as ItemService from "./items.service";

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
    const url = "https://pdf-lib.js.org/assets/with_update_sections.pdf"
    await ItemService.pdfedit(url);

    res.status(200).send("แปลงไฟล์สำเร็จ");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});





