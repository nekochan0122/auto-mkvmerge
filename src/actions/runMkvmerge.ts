import { resolve } from 'path'
import { execSync } from 'child_process'

import { Neko } from '../neko'
import { config } from '../config'

export const runMkvmerge = (neko: Neko) => {
  console.log('開始封裝：')

  for (let video of neko.videosName) {
    const videoPath = resolve(neko.basePath, video) // 影片路徑源
    const subtitleCmd = `--language 0:${config.subLang} "${resolve(neko.basePath, video.replace(neko.videoExt, config.subtitleExt))}"` // 字幕路徑源
    const outputVideoName = video.replace(neko.videoExt, config.videoOutputExt) // 輸出影片檔名
    const outputPath = resolve(neko.basePath, config.outputPath, outputVideoName) // 輸出影片路徑
    const audioName = neko.audiosName.find(audio => video.replace(neko.videoExt, '') === audio.replace(config.audioExt, '')) // 返回與當前影片跟某個音軌同名，返回該音軌檔名否則返回 undefined
    const audioCmd = audioName ? `--language 1:ja "${resolve(neko.basePath, audioName)}"` : '' // 音軌路徑

    try {
      execSync(`mkvmerge -o "${outputPath}" "${videoPath}" ${neko.fontsCmd} ${subtitleCmd} ${audioCmd} --track-order 0:0,0:1`)
    } catch (error) {
      console.log(error)
      console.log('\t發生錯誤 -', outputVideoName)
      continue
    }

    console.log('\t已完成 -', outputVideoName)
  }

  console.log('已完成所有任務。')
}
