const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const run = async () => {
  const { data } = await axios.get('https://www.baidu.com/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    }
  })
  const $ = cheerio.load(data, { decodeEntities: false })
  let list = setData($)
  mkdir('文本目录')
  saveText(list)
}
run()

const setData = ($) => {
  let list = []
  $('.hotsearch-item').each(function () {
    list.push({
      index: $(this).attr('data-index'),
      text: $(this).find('.title-content-title').text(),
      url: $(this).find('.title-content').attr('href')
    })
  })
  return list
}

const mkdir = (pathName) => {
  const fullPath = path.resolve(__dirname, pathName)
  if (fs.existsSync(fullPath)) {
    console.log('目录已存在')
    return
  }
  fs.mkdirSync(fullPath)
}

const saveText = (list) => {
  fs.writeFileSync('./文本目录/text.json', JSON.stringify({ list }), { encoding: 'utf8' })
}
