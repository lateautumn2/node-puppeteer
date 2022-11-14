const request = require('request')
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

let url =
  'https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fm=index&fr=&hs=0&xthttps=111110&sf=1&fmq=&pv=&ic=0&nc=1&z=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&word=狗&oq=狗&rsp=-1'

const run = async () => {
  const browser = await puppeteer.launch({
    //无头浏览器调试
    devtools: false
  })
  const page = await browser.newPage()
  await page.goto(url)
  let list = await getUrl(page)
  browser.close()
  mkdir('images')
  donwImg(list, 'images')
}
run()

const getUrl = async (page) => {
  return (val = await page.evaluate(() => {
    let list = []
    let h = document.querySelectorAll('#imgid>.imgpage>.imglist>.imgitem')
    h.forEach((item, index) => {
      list.push(item.dataset.thumburl)
    })
    return list
  }))
}

const mkdir = (name) => {
  const fullPath = path.resolve(__dirname, name)
  if (fs.existsSync(fullPath)) {
    console.log('目录已存在')
    return
  }
  fs.mkdirSync(fullPath)
}

const donwImg = (list, name) => {
  list.forEach((item, index) => {
    request(item).pipe(fs.createWriteStream(path.join(__dirname, name) + '/' + index + '.jpg'))
  })
}
