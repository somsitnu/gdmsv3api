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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reStampKumsang = exports.stampRegister = exports.stampTest = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const db_1 = require("./../../db");
const wordwrap = require('wordwrapjs');
const buddhistEra = require('dayjs/plugin/buddhistEra');
dayjs_1.default.extend(buddhistEra);
require('dayjs/locale/th');
dayjs_1.default.locale('th');
const { PageSizes, PDFDocument, StandardFonts, drawLinesOfText, rgb, degrees, PDFFont, layoutMultilineText } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const path = require('path');
const fs = require('fs');
const downloadpdf = require('downloadjs');
const thaiFontBytes = fs.readFileSync('./assets/fonts/Sarabun/Sarabun-Regular.ttf');
/**
 * Service Methods
 */
function isImageJpg(url) {
    return __awaiter(this, void 0, void 0, function* () {
        //return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        return url.match(/\.(jpeg|jpg)$/) != null;
        //return /\.(jpg|jpeg)$/.test(url);
    });
}
function isImagePng(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return url.match(/\.(png)$/) != null;
        //return /\.(png)$/.test(url);
    });
}
const stampTest = (data) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.stampTest = stampTest;
const stampRegister = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPdfBytes = yield fetch(data.file).then((res) => res.arrayBuffer());
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
    const path = yield process.env.STORAGE_PATH;
    const pathExport = path + 'testPdf.pdf';
    console.log(pathExport);
    return fs.writeFileSync(pathExport, pdfBytes);
});
exports.stampRegister = stampRegister;
// export const reStampKumsang = async (data: any) => {
//   const existingPdfBytes = await fetch(data.file).then(res => res.arrayBuffer())
//   const pdfDoc = await PDFDocument.load(existingPdfBytes)
//   pdfDoc.registerFontkit(fontkit)
//   const sarabunFont = await pdfDoc.embedFont(thaiFontBytes)
//   const pages = pdfDoc.getPages()
//   const firstPage = pages[0]
//   const { width, height } = firstPage.getSize()
//   firstPage.drawText(`${data.court_name}\n`+
//           `รับที่ ${data.keep_on}\n`+
//           `วันที่ ${dayjs(data.keep_date).format('d MMMM BBBB')}\n`+
//           // `เวลา ${data.created_at} ผู้รับ ${getdatas.owner}\n`,
//           `เวลา ${dayjs(data.created_at).format('HH:mm')} น.`,
//           {
//             x: width - 200,
//             y: height - 20,
//             size: 12,
//             font: sarabunFont,
//             color: rgb(0, 0, 1),
//             lineHeight: 16,
//           }),
//           firstPage.drawRectangle({
//             x: width - 210,
//             y: height - 80,
//             width: 180,
//             height: 73,
//             borderColor: rgb(0, 0, 1),
//             borderWidth: 1.5,
//           })
//   const pdfBytes = await pdfDoc.save();
//   const path = await process.env.STORAGE_PATH
//   const pathExport =  path + data.filename;
//   return fs.writeFileSync(pathExport, pdfBytes);
// }
const reStampKumsang = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const datas = {
        court_name: data.court_name,
        keep_on: data.keep_on,
        keep_date: data.keep_date,
        filename: data.filename,
        created_at: data.created_at,
        file: data.file,
        user_asarabun: data.user_asarabun,
        asarabun_comment: data.asarabun_comment,
        date_checkasarabun: data.date_checkasarabun,
        user_director: data.user_director,
        director_comment: data.director_comment,
        date_checkdirector: data.date_checkdirector,
        user_boss: data.user_boss,
        boss_comment: data.boss_comment,
        date_checkboss: data.date_checkboss,
    };
    console.log(datas);
    const path = yield process.env.STORAGE_PATH;
    // Load a PDF document
    const existingPdfBytes = yield fetch(datas.file).then((res) => res.arrayBuffer());
    // Create a new PDF document
    const pdfDoc = yield PDFDocument.create();
    // Add the existing PDF pages to the new document
    const existingPdfDoc = yield PDFDocument.load(existingPdfBytes);
    const existingPdfPages = yield pdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());
    existingPdfPages.forEach((page) => pdfDoc.addPage(page));
    // Add a new page to the new document size a4
    pdfDoc.addPage([595.28, 841.89]);
    pdfDoc.registerFontkit(fontkit);
    const sarabunFont = yield pdfDoc.embedFont(thaiFontBytes, { subset: true });
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    firstPage.drawText(`${datas.court_name}\n` +
        `รับที่ ${datas.keep_on}\n` +
        `วันที่ ${(0, dayjs_1.default)(datas.keep_date).format('d MMMM BBBB')}\n` +
        // `เวลา ${data.created_at} ผู้รับ ${getdatas.owner}\n`,
        `เวลา ${(0, dayjs_1.default)(datas.created_at).format('HH:mm')} น.`, {
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
    // check last pages
    const lastPageIndex = pdfDoc.getPageCount() - 1;
    const lastPage = pages[lastPageIndex];
    lastPage.drawText(`${datas.court_name}\n` +
        `รับที่ ${datas.keep_on}\n` +
        `วันที่ ${(0, dayjs_1.default)(datas.keep_date).format('d MMMM BBBB')}\n` +
        // `เวลา ${data.created_at} ผู้รับ ${getdatas.owner}\n`,
        `เวลา ${(0, dayjs_1.default)(datas.created_at).format('HH:mm')} น.`, {
        x: lastPage.getWidth() - 200,
        y: lastPage.getHeight() - 30,
        size: 12,
        font: sarabunFont,
        color: rgb(0, 0, 1),
        lineHeight: 16,
    }),
        lastPage.drawRectangle({
            x: lastPage.getWidth() - 210,
            y: lastPage.getHeight() - 90,
            width: 180,
            height: 73,
            borderColor: rgb(0, 0, 1),
            borderWidth: 1.5,
        });
    // Stamp Kumsang Asarabun
    if (datas.user_asarabun != '') {
        const id = datas.user_asarabun;
        db_1.db.query('SELECT * FROM `users` WHERE `id` = ?', [id], function (err, results) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = JSON.parse(JSON.stringify(results));
                //lastPage.moveTo(25,730)
                const text = datas.asarabun_comment;
                console.log(text.length);
                const textWrap = 60;
                const Wtext = wordwrap.wrap(text, { width: textWrap });
                //let text = Wtext.value;
                let lines = Wtext.split("\n");
                const countLines = lines.length;
                console.log(countLines);
                if (results) {
                    lastPage.drawText(`${Wtext}`, {
                        x: 40,
                        y: 750,
                        size: 12,
                        font: sarabunFont,
                        lineHeight: 16,
                    });
                    const checkLine = (countLines + 2) * 20;
                    const imgUrl = path + result[0].avatar;
                    // const imgUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'
                    // const imageBytes = await fetch(imgUrl).then((res) => res.arrayBuffer())
                    const imageBytes = fs.readFileSync(imgUrl);
                    let Image;
                    console.log(isImagePng(imgUrl));
                    if ((yield isImageJpg(imgUrl)) === true) {
                        Image = yield pdfDoc.embedJpg(imageBytes);
                    }
                    else if ((yield isImagePng(imgUrl)) === true) {
                        Image = yield pdfDoc.embedPng(imageBytes);
                    }
                    else {
                        console.log('Type Not Support');
                    }
                    const imgDims = Image.scale(0.20);
                    //const jpgDims = typeImg.scale(0.25);
                    lastPage.drawImage(Image, {
                        x: 60,
                        y: 750 - checkLine,
                        width: imgDims.width,
                        height: imgDims.height,
                        // x: lastPage.getWidth() / 2 - imgDims.width / 2,
                        // y: lastPage.getHeight() / 2 - imgDims.height / 2,
                        // width: imgDims.width,
                        // height: imgDims.height,
                    });
                    lastPage.drawText(`      (${result[0].name})   \n` +
                        `${result[0].position}\n` +
                        `       ${(0, dayjs_1.default)(datas.date_checkasarabun).format('d MMMM BBBB')}`, {
                        x: 55,
                        y: 750 - checkLine - 30,
                        size: 12,
                        font: sarabunFont,
                        lineHeight: 16,
                    });
                    // Save the new PDF document
                    const pdfBytes = yield pdfDoc.save();
                    const pathExport = path + data.filename;
                    return fs.writeFileSync(pathExport, pdfBytes);
                }
                else {
                    throw new Error('error');
                }
            });
        });
    }
    // Stamp for Director
    if (datas.user_director != '') {
        const id = datas.user_director;
        db_1.db.query('SELECT * FROM `users` WHERE `id` = ?', [id], function (err, results) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = JSON.parse(JSON.stringify(results));
                //lastPage.moveTo(25,730)
                const text = datas.director_comment;
                console.log(text.length);
                const textWrap = 60;
                const Wtext = wordwrap.wrap(text, { width: textWrap });
                //let text = Wtext.value;
                let lines = Wtext.split("\n");
                const countLines = lines.length;
                console.log(countLines);
                if (results) {
                    lastPage.drawText(`${Wtext}`, {
                        x: lastPage.getWidth() / 2,
                        y: 530,
                        size: 12,
                        font: sarabunFont,
                        lineHeight: 16,
                    });
                    const checkLine = (countLines + 2) * 20;
                    const imgUrl = path + result[0].avatar;
                    // const imgUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'
                    // const imageBytes = await fetch(imgUrl).then((res) => res.arrayBuffer())
                    const imageBytes = fs.readFileSync(imgUrl);
                    let Image;
                    console.log(isImagePng(imgUrl));
                    if ((yield isImageJpg(imgUrl)) === true) {
                        Image = yield pdfDoc.embedJpg(imageBytes);
                    }
                    else if ((yield isImagePng(imgUrl)) === true) {
                        Image = yield pdfDoc.embedPng(imageBytes);
                    }
                    else {
                        console.log('Type Not Support');
                    }
                    const imgDims = Image.scale(0.20);
                    //const jpgDims = typeImg.scale(0.25);
                    lastPage.drawImage(Image, {
                        x: lastPage.getWidth() / 2,
                        y: 530 - checkLine,
                        width: imgDims.width,
                        height: imgDims.height,
                        // x: lastPage.getWidth() / 2 - imgDims.width / 2,
                        // y: lastPage.getHeight() / 2 - imgDims.height / 2,
                        // width: imgDims.width,
                        // height: imgDims.height,
                    });
                    lastPage.drawText(`      (${result[0].name})   \n` +
                        `${result[0].position}\n` +
                        `       ${(0, dayjs_1.default)(datas.date_checkdirector).format('d MMMM BBBB')}`, {
                        x: lastPage.getWidth() / 2,
                        y: 530 - checkLine - 30,
                        size: 12,
                        font: sarabunFont,
                        lineHeight: 16,
                    });
                    // Save the new PDF document
                    const pdfBytes = yield pdfDoc.save();
                    const pathExport = path + data.filename;
                    return fs.writeFileSync(pathExport, pdfBytes);
                }
                else {
                    throw new Error('error');
                }
            });
        });
    }
    // Stamp for Boss
    if (datas.user_boss != '') {
        const id = datas.user_boss;
        db_1.db.query('SELECT * FROM `users` WHERE `id` = ?', [id], function (err, results) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = JSON.parse(JSON.stringify(results));
                //lastPage.moveTo(25,730)
                const text = datas.boss_comment;
                console.log(text.length);
                const textWrap = 60;
                const Wtext = wordwrap.wrap(text, { width: textWrap });
                //let text = Wtext.value;
                let lines = Wtext.split("\n");
                const countLines = lines.length;
                console.log(countLines);
                if (results) {
                    lastPage.drawText(`${Wtext}`, {
                        x: lastPage.getWidth() / 3,
                        y: 300,
                        size: 12,
                        font: sarabunFont,
                        lineHeight: 16,
                    });
                    const checkLine = (countLines + 2) * 20;
                    const imgUrl = path + result[0].avatar;
                    // const imgUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'
                    // const imageBytes = await fetch(imgUrl).then((res) => res.arrayBuffer())
                    const imageBytes = fs.readFileSync(imgUrl);
                    let Image;
                    console.log(isImagePng(imgUrl));
                    if ((yield isImageJpg(imgUrl)) === true) {
                        Image = yield pdfDoc.embedJpg(imageBytes);
                    }
                    else if ((yield isImagePng(imgUrl)) === true) {
                        Image = yield pdfDoc.embedPng(imageBytes);
                    }
                    else {
                        console.log('Type Not Support');
                    }
                    const imgDims = Image.scale(0.20);
                    //const jpgDims = typeImg.scale(0.25);
                    lastPage.drawImage(Image, {
                        x: lastPage.getWidth() / 3,
                        y: 300 - checkLine,
                        width: imgDims.width,
                        height: imgDims.height,
                        // x: lastPage.getWidth() / 2 - imgDims.width / 2,
                        // y: lastPage.getHeight() / 2 - imgDims.height / 2,
                        // width: imgDims.width,
                        // height: imgDims.height,
                    });
                    lastPage.drawText(`      (${result[0].name})   \n` +
                        `${result[0].position}\n` +
                        `       ${(0, dayjs_1.default)(datas.date_checkboss).format('d MMMM BBBB')}`, {
                        x: lastPage.getWidth() / 3,
                        y: 300 - checkLine - 30,
                        size: 12,
                        font: sarabunFont,
                        lineHeight: 16,
                    });
                    // Save the new PDF document
                    const pdfBytes = yield pdfDoc.save();
                    const pathExport = path + data.filename;
                    return fs.writeFileSync(pathExport, pdfBytes);
                }
                else {
                    throw new Error('error');
                }
            });
        });
    }
});
exports.reStampKumsang = reStampKumsang;
