import express, { Express, Request, Response } from 'express';
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
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
  //res.send('Express + TypeScript Server By Somsit');
  res.send('Express + TypeScript Server By Somsit');
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
function saveAs(file: File) {
  throw new Error('Function not implemented.');
}

