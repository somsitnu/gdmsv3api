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
exports.remove = exports.update = exports.create = exports.find = exports.findAll = exports.pdfedit = void 0;
const pdf_lib_1 = require("pdf-lib");
const fs = require('fs');
const downloadpdf = require("downloadjs");
let items = {
    1: {
        id: 1,
        name: "Burger",
        price: 599,
        description: "Tasty",
        image: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"
    },
    2: {
        id: 2,
        name: "Pizza",
        price: 299,
        description: "Cheesy",
        image: "https://cdn.auth0.com/blog/whatabyte/pizza-sm.png"
    },
    3: {
        id: 3,
        name: "Tea",
        price: 199,
        description: "Informative",
        image: "https://cdn.auth0.com/blog/whatabyte/tea-sm.png"
    }
};
/**
 * Service Methods
 */
const pdfedit = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const url = data;
    const existingPdfBytes = yield fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = yield pdf_lib_1.PDFDocument.load(existingPdfBytes);
    const helveticaFont = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    firstPage.drawText('Somsit Bunlang Dev!', {
        x: 5,
        y: height / 2 + 300,
        size: 50,
        font: helveticaFont,
        color: (0, pdf_lib_1.rgb)(0.95, 0.1, 0.1),
        rotate: (0, pdf_lib_1.degrees)(-45),
    });
    console.log("export");
    const pdfBytes = yield pdfDoc.save();
    return fs.writeFileSync('./testNU.pdf', pdfBytes);
    //Trigger the browser to download the PDF document
    //return downloadpdf(file,filePath);
});
exports.pdfedit = pdfedit;
const findAll = () => __awaiter(void 0, void 0, void 0, function* () { return Object.values(items); });
exports.findAll = findAll;
const find = (id) => __awaiter(void 0, void 0, void 0, function* () { return items[id]; });
exports.find = find;
const create = (newItem) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new Date().valueOf();
    items[id] = Object.assign({ id }, newItem);
    return items[id];
});
exports.create = create;
const update = (id, itemUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, exports.find)(id);
    if (!item) {
        return null;
    }
    items[id] = Object.assign({ id }, itemUpdate);
    return items[id];
});
exports.update = update;
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, exports.find)(id);
    if (!item) {
        return null;
    }
    delete items[id];
});
exports.remove = remove;
