"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stampKumsang = exports.stampRegister = void 0;
const { PageSizes, PDFDocument, StandardFonts, drawLinesOfText, rgb, degrees, PDFFont } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const path = require('path');
const fs = require('fs');
const downloadpdf = require('downloadjs');
const thaiFontBytes = fs.readFileSync('./assets/fonts/Sarabun/Sarabun-Regular.ttf');
/**
 * Service Methods
 */
const stampRegister = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPdfBytes = yield fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = yield PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const sarabunFont = yield pdfDoc.embedFont(thaiFontBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    firstPage.drawText(`${data.courtname}\n` +
        `รับที่ ${data.keep_on}\n` +
        `วันที่ ${data.keep_date}\n` +
        `เวลา ${data.created_at_time} ผู้รับ ${data.owner}\n`, {
        x: width - 200,
        y: height - 20,
        size: 12,
        font: sarabunFont,
        color: rgb(0, 0, 1),
        lineHeight: 16,
    }),
        firstPage.drawRectangle({
            x: width - 210,
            y: height - 80,
            width: 180,
            height: 73,
            borderColor: rgb(0, 0, 1),
            borderWidth: 1.5,
        });
    // firstPage.addContentStreams(pdfDoc.register(newContentStream));
    const pdfBytes = yield pdfDoc.save();
    const pathExport = './storage/text.pdf';
    console.log(pathExport);
    return fs.writeFileSync(pathExport, pdfBytes);
});
exports.stampRegister = stampRegister;
const stampKumsang = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPdfBytes = yield fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = yield PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const sarabunFont = yield pdfDoc.embedFont(thaiFontBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const text = "sfjsaldkfjasldkfjalsdfjasldkffasdlkf";
    firstPage.drawText(text, {
        x: width - 200,
        y: height - 20,
        size: 12,
        font: sarabunFont,
        color: rgb(0, 0, 1),
        lineHeight: 16,
    }),
        firstPage.drawRectangle({
            x: width - 210,
            y: height - 80,
            width: 180,
            height: 73,
            borderColor: rgb(0, 0, 1),
            borderWidth: 1.5,
        });
    // firstPage.addContentStreams(pdfDoc.register(newContentStream));
    const pdfBytes = yield pdfDoc.save();
    const pathExport = './storage/text.pdf';
    console.log(pathExport);
    return fs.writeFileSync(pathExport, pdfBytes);
});
exports.stampKumsang = stampKumsang;
