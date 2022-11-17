const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

let browser = null
;(async () => {
  browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://es6.ruanyifeng.com')
  const list = await getTag(page)
  page.close()
  console.log(list)
  await mkdir('ES6入门')
  await download(list, 'ES6入门')
  await browser.close()
})()

const getTag = async (page) => {
  let tags
  return (tags = await page.evaluate(() => {
    let a = [...document.querySelectorAll('ol li a')]
    return a.map((item, index) => {
      return {
        src: item.href.trim(),
        name: item.text,
        page: index
      }
    })
  }))
}

const mkdir = (name) => {
  const fullPath = path.resolve(__dirname, name)
  if (fs.existsSync(fullPath)) {
    return console.log('文件夹已存在')
  }
  fs.mkdirSync(fullPath)
}

const download = async (list, name) => {
  for (let i = 0; i < list.length; i++) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 800 })
    await page.goto(list[i].src, { waitUtil: 'networkidle0' })
    await page.pdf({ path: path.join(__dirname, name) + '/' + list[i].page + '.' + list[i].name + '.pdf' })
    console.log('正在copy中......')
    await page.close()
  }
}
