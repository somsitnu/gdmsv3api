import express, { Express, Request, Response } from 'express';
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";const {
  PageSizes,
  PDFDocument,
  StandardFonts,
  drawLinesOfText,
  rgb,
  degrees,
  PDFFont
} = require('pdf-lib')
const fs = require('fs')
import dayjs from 'dayjs';
const buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)
require('dayjs/locale/th')
dayjs.locale('th')

import { pdfRouter } from "./services/pdfservice/pdfedit.router";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
 }

const PORT: number = parseInt(process.env.PORT as string, 10);
const app: Express = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/pdfservice", pdfRouter);
app.get('/', async (req: Request, res: Response) => {
    res.send(`⚡️[server]: Server is running`);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
function saveAs(file: File) {
  throw new Error('Function not implemented.');
}

