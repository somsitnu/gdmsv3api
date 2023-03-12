import { Request, Response } from 'express'

// src/items/items.service.ts

/**
 * Data Model Interfaces
 */

const {
  PageSizes,
  PDFDocument,
  StandardFonts,
  drawLinesOfText,
  rgb,
  degrees,
} = require('pdf-lib')
const fontkit = require('@pdf-lib/fontkit')
const path = require('path')
const fs = require('fs')
const downloadpdf = require('downloadjs')

/**
 * Service Methods
 */
export const stampRegister = async (data: any) => {

  const thaiFontBytes = fs.readFileSync(
    './assets/fonts/Sarabun/Sarabun-Regular.ttf',
  )

  const existingPdfBytes = await fetch(data.filepdf).then((res) =>
    res.arrayBuffer(),
  )

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  pdfDoc.registerFontkit(fontkit)
  const sarabunFont = await pdfDoc.embedFont(thaiFontBytes)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()

  firstPage.drawText(  `${data.courtname}\n` +
          `เลขรับที่: ${data.keep_on}\n` +
          `วันที่ : ${data.keep_date}\n` +
          `เวลา : ${data.keep_date}\n`,
          {
            x: 405,
            y: height - 20,
            size: 12,
            font: sarabunFont,
            color: rgb(0, 0, 1),
            lineHeight: 16,
            opacity: 0.75,
          }),
 
    firstPage.drawRectangle({
      x: 400,
      y: height - 80,
      width: 180,
      height: 73,
      borderColor: rgb(0, 0, 1),
      borderWidth: 1.5,
    })
  // firstPage.addContentStreams(pdfDoc.register(newContentStream));
  const pdfBytes = await pdfDoc.save()
  const pathExport = './storage/text.pdf';
  console.log(pathExport);
  return fs.writeFileSync(pathExport, pdfBytes)
  console.log(`PDF file written to: ${filePath}`);
}
