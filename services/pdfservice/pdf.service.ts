import { Request, Response } from 'express'

const {
  PageSizes,
  PDFDocument,
  StandardFonts,
  drawLinesOfText,
  rgb,
  degrees,
  PDFFont
} = require('pdf-lib')
const fontkit = require('@pdf-lib/fontkit')
const path = require('path')
const fs = require('fs')
const downloadpdf = require('downloadjs')
const thaiFontBytes = fs.readFileSync(
    './assets/fonts/Sarabun/Sarabun-Regular.ttf',
  )

/**
 * Service Methods
 */

export const stampRegister = async (data: any) => {

const getdatas = {
  courtname : data.courtname,
  keep_on : data.keep_on,
  keep_date : data.keep_date,
  created_at_time : data.created_at_time,
  owner : data.owner,
  file : data.filepdf
}
const existingPdfBytes = await fetch(getdatas.file).then(res => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  pdfDoc.registerFontkit(fontkit)
  const sarabunFont = await pdfDoc.embedFont(thaiFontBytes)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()

  firstPage.drawText(`${getdatas.courtname}\n`+
          `รับที่ ${getdatas.keep_on}\n`+
          `วันที่ ${getdatas.keep_date}\n`+
          `เวลา ${getdatas.created_at_time} ผู้รับ ${getdatas.owner}\n`,
          {
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
          })
  // firstPage.addContentStreams(pdfDoc.register(newContentStream));
  const pdfBytes = await pdfDoc.save()
  const path = await process.env.STORAGE_PATH
  const pathExport =  path + "testPdf.pdf"
  console.log(pathExport);
  return fs.writeFileSync(pathExport, pdfBytes);

}

export const stampKumsang = async (data: any) => {

  const existingPdfBytes = await fetch(data.filepdf).then(res => res.arrayBuffer())
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  pdfDoc.registerFontkit(fontkit)
  const sarabunFont = await pdfDoc.embedFont(thaiFontBytes)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  firstPage.drawText(data.id,
          {
            x: width - 200,
            y: height - 20,
            size: 12,
            font: sarabunFont,
            color: rgb(0, 0, 1),
            lineHeight: 16
          })

  // firstPage.addContentStreams(pdfDoc.register(newContentStream));
  const pdfBytes = await pdfDoc.save()
  const pathExport = './storage/text.pdf'
  console.log(pathExport);
  return fs.writeFileSync(pathExport, pdfBytes);
}
