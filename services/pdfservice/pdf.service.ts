import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import { BaseUser } from './user.interface'
import { OkPacket, RowDataPacket } from 'mysql2'
import { db } from './../../db'
const wordwrap = require('wordwrapjs')
const buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)
require('dayjs/locale/th')
dayjs.locale('th')

const {
  PageSizes,
  PDFDocument,
  StandardFonts,
  drawLinesOfText,
  rgb,
  degrees,
  PDFFont,
  layoutMultilineText,
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
async function isImageJpg(url: string) {
  //return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  return url.match(/\.(jpeg|jpg)$/) != null
  //return /\.(jpg|jpeg)$/.test(url);
}

async function isImagePng(url: string) {
  return url.match(/\.(png)$/) != null
  //return /\.(png)$/.test(url);
}

export const stampTest = async (data: any) => { }

export const stampRegister = async (data: any) => {
  const datas = {
    court_name: data.court_name,
    keep_on: data.keep_on,
    keep_date: data.keep_date,
    file: data.file,
  }

  const existingPdfBytes = await fetch(datas.file).then((res) =>
    res.arrayBuffer(),
  )

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  pdfDoc.registerFontkit(fontkit)
  const sarabunFont = await pdfDoc.embedFont(thaiFontBytes)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()

  firstPage.drawText(
    `${data.courtname}\n` +
    `รับที่ ${data.keep_on}\n` +
    `วันที่ ${data.keep_date}\n` +
    `เวลา ${data.created_at_time} ผู้รับ ${data.owner}\n`,
    {
      x: width - 200,
      y: height - 20,
      size: 12,
      font: sarabunFont,
      color: rgb(0, 0, 1),
      lineHeight: 16,
    },
  ),
    firstPage.drawRectangle({
      x: width - 210,
      y: height - 80,
      width: 180,
      height: 73,
      borderColor: rgb(0, 0, 1),
      borderWidth: 1.5,
    })
  // Save the new PDF document
  const pdfBytes = await pdfDoc.save()
  const pathExport = path + data.filename
  return fs.writeFileSync(pathExport, pdfBytes)
}

export const stampAsarabun = async (data: any) => {

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
  }
  //console.log(datas)
  const path = await process.env.STORAGE_PATH
  // Load a PDF document
  const existingPdfBytes = await fetch(datas.file).then((res) =>
    res.arrayBuffer(),
  )

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()

  // Add the existing PDF pages to the new document
  const existingPdfDoc = await PDFDocument.load(existingPdfBytes)
  const existingPdfPages = await pdfDoc.copyPages(
    existingPdfDoc,
    existingPdfDoc.getPageIndices(),
  )
  existingPdfPages.forEach((page: any) => pdfDoc.addPage(page))

  // Add a new page to the new document size a4
  pdfDoc.addPage([595.28, 841.89])

  pdfDoc.registerFontkit(fontkit)
  const sarabunFont = await pdfDoc.embedFont(thaiFontBytes, { subset: true })
  const pages = pdfDoc.getPages()

  // check last pages
  const lastPageIndex = pdfDoc.getPageCount() - 1
  const lastPage = pages[lastPageIndex]
  lastPage.drawText(
    `${datas.court_name}\n` +
    `รับที่ ${datas.keep_on}\n` +
    `วันที่ ${dayjs(datas.keep_date).format('d MMMM BBBB')}\n` +
    // `เวลา ${data.created_at} ผู้รับ ${getdatas.owner}\n`,
    `เวลา ${dayjs(datas.created_at).format('HH:mm')} น.`,
    {
      x: lastPage.getWidth() - 200,
      y: lastPage.getHeight() - 30,
      size: 12,
      font: sarabunFont,
      color: rgb(0, 0, 1),
      lineHeight: 16,
    },
  ),
    lastPage.drawRectangle({
      x: lastPage.getWidth() - 210,
      y: lastPage.getHeight() - 90,
      width: 180,
      height: 73,
      borderColor: rgb(0, 0, 1),
      borderWidth: 1.5,
    })
  // Stamp Kumsang Asarabun
  if (datas.user_asarabun != '') {
    const id = datas.user_asarabun
    db.query('SELECT * FROM `users` WHERE `id` = ?', [id], async function (
      err,
      results,
    ) {
      const result = JSON.parse(JSON.stringify(results))
      //lastPage.moveTo(25,730)
      const text = datas.asarabun_comment
      console.log(text.length)
      const textWrap = 60
      const Wtext = wordwrap.wrap(text, { width: textWrap })
      //let text = Wtext.value;
      let lines = Wtext.split('\n')
      const countLines = lines.length
      console.log(countLines)
      if (results) {
        lastPage.drawText(`${Wtext}`, {
          x: 40,
          y: 750,
          size: 12,
          font: sarabunFont,
          lineHeight: 16,
        })
        const checkLine = (countLines + 2) * 20
        const imgUrl = path + result[0].avatar
        // const imgUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'
        // const imageBytes = await fetch(imgUrl).then((res) => res.arrayBuffer())
        const imageBytes = fs.readFileSync(imgUrl)
        let Image: any
        console.log(isImagePng(imgUrl))
        if ((await isImageJpg(imgUrl)) === true) {
          Image = await pdfDoc.embedJpg(imageBytes)
        } else if ((await isImagePng(imgUrl)) === true) {
          Image = await pdfDoc.embedPng(imageBytes)
        } else {
          console.log('Type Not Support')
        }
        const imgDims = Image.scale(0.2)

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
        })

        lastPage.drawText(
          `      (${result[0].name})   \n` +
          `${result[0].position}\n` +
          `       ${dayjs(datas.date_checkasarabun).format('d MMMM BBBB')}`,
          {
            x: 55,
            y: 750 - checkLine - 30,
            size: 12,
            font: sarabunFont,
            lineHeight: 16,
          },
        )
        // Save the new PDF document
        const pdfBytes = await pdfDoc.save()
        const pathExport = path + data.filename
        return fs.writeFileSync(pathExport, pdfBytes)
      } else {
        throw new Error('error')
      }
    })
  }

}

export const reStampKumsang = async (data: any) => {
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
  }
  //console.log(datas)
  const path = await process.env.STORAGE_PATH
  // Load a PDF document
  const existingPdfBytes = await fetch(datas.file).then((res) =>
    res.arrayBuffer(),
  )

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()

  // Add the existing PDF pages to the new document
  const existingPdfDoc = await PDFDocument.load(existingPdfBytes)
  const existingPdfPages = await pdfDoc.copyPages(
    existingPdfDoc,
    existingPdfDoc.getPageIndices(),
  )
  existingPdfPages.forEach((page: any) => pdfDoc.addPage(page))

  // Add a new page to the new document size a4
  pdfDoc.addPage([595.28, 841.89])

  pdfDoc.registerFontkit(fontkit)
  const sarabunFont = await pdfDoc.embedFont(thaiFontBytes, { subset: true })
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  firstPage.drawText(
    `${datas.court_name}\n` +
    `รับที่ ${datas.keep_on}\n` +
    `วันที่ ${dayjs(datas.keep_date).format('d MMMM BBBB')}\n` +
    // `เวลา ${data.created_at} ผู้รับ ${getdatas.owner}\n`,
    `เวลา ${dayjs(datas.created_at).format('HH:mm')} น.`,
    {
      x: width - 200,
      y: height - 20,
      size: 12,
      font: sarabunFont,
      color: rgb(0, 0, 1),
      lineHeight: 16,
    },
  ),
    firstPage.drawRectangle({
      x: width - 210,
      y: height - 80,
      width: 180,
      height: 73,
      borderColor: rgb(0, 0, 1),
      borderWidth: 1.5,
    })
  // check last pages
  const lastPageIndex = pdfDoc.getPageCount() - 1
  const lastPage = pages[lastPageIndex]
  lastPage.drawText(
    `${datas.court_name}\n` +
    `รับที่ ${datas.keep_on}\n` +
    `วันที่ ${dayjs(datas.keep_date).format('d MMMM BBBB')}\n` +
    // `เวลา ${data.created_at} ผู้รับ ${getdatas.owner}\n`,
    `เวลา ${dayjs(datas.created_at).format('HH:mm')} น.`,
    {
      x: lastPage.getWidth() - 200,
      y: lastPage.getHeight() - 30,
      size: 12,
      font: sarabunFont,
      color: rgb(0, 0, 1),
      lineHeight: 16,
    },
  ),
    lastPage.drawRectangle({
      x: lastPage.getWidth() - 210,
      y: lastPage.getHeight() - 90,
      width: 180,
      height: 73,
      borderColor: rgb(0, 0, 1),
      borderWidth: 1.5,
    })
  // Stamp Kumsang Asarabun
  if (datas.user_asarabun != '') {
    const id = datas.user_asarabun
    db.query('SELECT * FROM `users` WHERE `id` = ?', [id], async function (
      err,
      results,
    ) {
      const result = JSON.parse(JSON.stringify(results))
      //lastPage.moveTo(25,730)
      const text = datas.asarabun_comment
      console.log(text.length)
      const textWrap = 60
      const Wtext = wordwrap.wrap(text, { width: textWrap })
      //let text = Wtext.value;
      let lines = Wtext.split('\n')
      const countLines = lines.length
      console.log(countLines)
      if (results) {
        lastPage.drawText(`${Wtext}`, {
          x: 40,
          y: 750,
          size: 12,
          font: sarabunFont,
          lineHeight: 16,
        })
        const checkLine = (countLines + 2) * 20
        const imgUrl = path + result[0].avatar
        // const imgUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'
        // const imageBytes = await fetch(imgUrl).then((res) => res.arrayBuffer())
        const imageBytes = fs.readFileSync(imgUrl)
        let Image: any
        console.log(isImagePng(imgUrl))
        if ((await isImageJpg(imgUrl)) === true) {
          Image = await pdfDoc.embedJpg(imageBytes)
        } else if ((await isImagePng(imgUrl)) === true) {
          Image = await pdfDoc.embedPng(imageBytes)
        } else {
          console.log('Type Not Support')
        }
        const imgDims = Image.scale(0.2)

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
        })

        lastPage.drawText(
          `      (${result[0].name})   \n` +
          `${result[0].position}\n` +
          `       ${dayjs(datas.date_checkasarabun).format('d MMMM BBBB')}`,
          {
            x: 55,
            y: 750 - checkLine - 30,
            size: 12,
            font: sarabunFont,
            lineHeight: 16,
          },
        )
        // Save the new PDF document
        const pdfBytes = await pdfDoc.save()
        const pathExport = path + data.filename
        return fs.writeFileSync(pathExport, pdfBytes)
      } else {
        throw new Error('error')
      }
    })
  }
  // Stamp for Director
  if (datas.user_director != '') {
    const id = datas.user_director
    db.query('SELECT * FROM `users` WHERE `id` = ?', [id], async function (
      err,
      results,
    ) {
      const result = JSON.parse(JSON.stringify(results))
      //lastPage.moveTo(25,730)
      const text = datas.director_comment
      console.log(text.length)
      const textWrap = 60
      const Wtext = wordwrap.wrap(text, { width: textWrap })
      //let text = Wtext.value;
      let lines = Wtext.split('\n')
      const countLines = lines.length
      console.log(countLines)
      if (results) {
        lastPage.drawText(`${Wtext}`, {
          x: lastPage.getWidth() / 2,
          y: 530,
          size: 12,
          font: sarabunFont,
          lineHeight: 16,
        })
        const checkLine = (countLines + 2) * 20
        const imgUrl = path + result[0].avatar
        // const imgUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'
        // const imageBytes = await fetch(imgUrl).then((res) => res.arrayBuffer())
        const imageBytes = fs.readFileSync(imgUrl)
        let Image: any
        console.log(isImagePng(imgUrl))
        if ((await isImageJpg(imgUrl)) === true) {
          Image = await pdfDoc.embedJpg(imageBytes)
        } else if ((await isImagePng(imgUrl)) === true) {
          Image = await pdfDoc.embedPng(imageBytes)
        } else {
          console.log('Type Not Support')
        }
        const imgDims = Image.scale(0.2)

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
        })

        lastPage.drawText(
          `      (${result[0].name})   \n` +
          `${result[0].position}\n` +
          `       ${dayjs(datas.date_checkdirector).format('d MMMM BBBB')}`,
          {
            x: lastPage.getWidth() / 2,
            y: 530 - checkLine - 30,
            size: 12,
            font: sarabunFont,
            lineHeight: 16,
          },
        )
        // Save the new PDF document
        const pdfBytes = await pdfDoc.save()
        const pathExport = path + data.filename
        return fs.writeFileSync(pathExport, pdfBytes)
      } else {
        throw new Error('error')
      }
    })
  }
  // Stamp for Boss

  if (datas.user_boss != '') {
    const id = datas.user_boss
    db.query('SELECT * FROM `users` WHERE `id` = ?', [id], async function (
      err,
      results,
    ) {
      const result = JSON.parse(JSON.stringify(results))
      //lastPage.moveTo(25,730)
      const text = datas.boss_comment
      console.log(text.length)
      const textWrap = 60
      const Wtext = wordwrap.wrap(text, { width: textWrap })
      //let text = Wtext.value;
      let lines = Wtext.split('\n')
      const countLines = lines.length
      console.log(countLines)
      if (results) {
        lastPage.drawText(`${Wtext}`, {
          x: lastPage.getWidth() / 3,
          y: 300,
          size: 12,
          font: sarabunFont,
          lineHeight: 16,
        })
        const checkLine = (countLines + 2) * 20
        const imgUrl = path + result[0].avatar
        // const imgUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'
        // const imageBytes = await fetch(imgUrl).then((res) => res.arrayBuffer())
        const imageBytes = fs.readFileSync(imgUrl)
        let Image: any
        console.log(isImagePng(imgUrl))
        if ((await isImageJpg(imgUrl)) === true) {
          Image = await pdfDoc.embedJpg(imageBytes)
        } else if ((await isImagePng(imgUrl)) === true) {
          Image = await pdfDoc.embedPng(imageBytes)
        } else {
          console.log('Type Not Support')
        }
        const imgDims = Image.scale(0.2)

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
        })

        lastPage.drawText(
          `      (${result[0].name})   \n` +
          `${result[0].position}\n` +
          `       ${dayjs(datas.date_checkboss).format('d MMMM BBBB')}`,
          {
            x: lastPage.getWidth() / 3,
            y: 300 - checkLine - 30,
            size: 12,
            font: sarabunFont,
            lineHeight: 16,
          },
        )
        // Save the new PDF document
        const pdfBytes = await pdfDoc.save()
        const pathExport = path + data.filename
        return fs.writeFileSync(pathExport, pdfBytes)
      } else {
        throw new Error('error')
      }
    })
  }
}
