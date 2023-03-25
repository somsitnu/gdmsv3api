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

// Route Stamp Register
pdfRouter.post("/stamp-register", async (req: Request, res: Response) => {
  const getd = req.body;
  try {
    // Register Stamp in Book
    await PdfService.stampRegister(getd);
    res.status(200).send("ลงทะเบียนรับ");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// Route Stamp Asarabun
pdfRouter.post("/stamp-asarabun", async (req: Request, res: Response) => {
  const getd = req.body;
  try {
    // Register Stamp in Book
    await PdfService.stampAsarabun(getd);
    res.status(200).send("ลงทะเบียนรับ");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// pdfRouter.get("/stamp-kumsang/:id", async (req: Request, res: Response) => {
pdfRouter.post("/re-stamp-kumsang", async (req: Request, res: Response) => {
   const getd = req.body;
  try {
    // Register Stamp in Book
    await PdfService.reStampKumsang(getd);
    res.status(200).send("ประทับคำสั่งทั้งหมด");
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});



 

