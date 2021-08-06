import { createInterface } from 'readline'
import { readdirSync } from 'fs'
import { execSync } from 'child_process'
import { resolve } from 'path'

// 設定區
const config = {
  videoExt: '.mkv', // 影片副檔名
  videoOutputExt: '.mkv', // 輸出影片副檔名
  subtitleExt: '.ass', // 字幕副檔名
  subLang: 'zh-TW', // 字幕語言
  fonts: 'Fonts/', // 字體資料夾位置（相對）
  output: 'Merges/', // 合併輸出目錄（相對）
}

// 目標路徑
let basePath: null | string = null

// 輸入介面實例
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// loopAction
async function loopAction() {
  await inputPath()
  await main()

  loopAction()
}

// 提示輸入
function inputPath() {
  return new Promise(res => {
    rl.question('請輸入目標路徑 (不帶引號) :\n', path => {
      basePath = path
      res(null)
    })
  })
}

// 核心函式
function main() {
  return new Promise(res => {
    if (basePath === null) return // 防止 basePath 為 null

    let files: string[] // 檔案
    let videos: string[] // 影片
    let subtitles: string[] // 字幕
    let fonts: string[] // 字體
    let fontResult = ' ' // 字體指令參數

    // 讀取資料夾
    try {
      files = readdirSync(basePath)
    } catch (error) {
      // 處理 error
      console.error(error)
      return console.log('請檢察目標路徑格式是否正確。')
    }

    // 獲取影片與字幕檔名
    videos = filesFilter(files, config.videoExt)
    subtitles = filesFilter(files, config.subtitleExt)

    // 如果影片或字幕不存在
    if (!videos.length || !subtitles.length) return console.log('影片或字幕不存在。')

    // 檢查影片與字幕長度
    if (videos.length !== subtitles.length) return console.log('請檢察影片與字幕數量是否完全一致。')

    // 檢查檔名(以影片檔名匹配字幕)
    video: for (let video of videos) {
      for (let subtitle of subtitles) {
        if (subtitle.replace(config.subtitleExt, '') === video.replace(config.videoExt, '')) continue video
      }
      return console.log(`請檢察 ${video} 與字幕檔名是否完全一致。`)
    }

    // 獲取所有字體陣列
    fonts = readdirSync(resolve(basePath, config.fonts))

    // 根據字體陣列處理字體參數
    for (let font of fonts) {
      const ext = font.split('.').pop()

      // 處理 mime-type
      switch (ext) {
        case 'otf':
          fontResult += `--attachment-mime-type font/otf`
          break

        case 'ttf':
          fontResult += `--attachment-mime-type font/ttf`
          break

        case 'ttc':
          fontResult += `--attachment-mime-type font/collection`
          break
      }

      fontResult += ` --attach-file "${resolve(basePath, config.fonts)}\\${font}" `
    }

    // 開始執行 mkvmerge
    for (let video of videos) {
      const videoPath = resolve(basePath, video)
      const subtitlePath = resolve(basePath, video.replace(config.videoExt, config.subtitleExt))
      const outputPath = resolve(basePath, config.output, video.replace(config.videoExt, config.videoOutputExt))

      execSync(
        `mkvmerge -o "${outputPath}" "${videoPath}" --language 0:${config.subLang} "${subtitlePath}" ${fontResult}`
      )
      console.log('已完成 :', video.replace(config.videoExt, config.videoOutputExt))
    }

    // 重置目標路徑
    basePath = null

    console.log('已完成所有任務。')

    res(null)
  })
}

function filesFilter(files: string[], ext: string) {
  return files.filter(file => file.endsWith(ext))
}

loopAction()
