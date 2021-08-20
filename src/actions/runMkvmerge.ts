import { resolve } from 'path'
import { execSync } from 'child_process'

import { config } from '../config'

export const runMkvmerge = neko => {
  console.log('開始封裝：')

  for (let video of neko.videosName) {
    const videoPath = resolve(neko.basePath, video)
    const subtitlePath = resolve(neko.basePath, video.replace(neko.videoExt, config.subtitleExt))
    const outputVideoName = video.replace(neko.videoExt, config.videoOutputExt)
    const outputPath = resolve(neko.basePath, config.outputPath, outputVideoName)

    try {
      execSync(`mkvmerge -o "${outputPath}" "${videoPath}" --language 0:${config.subLang} "${subtitlePath}" ${neko.fontsCmd}`)
    } catch (error) {
      console.log(error)
      console.log('\t發生錯誤 -', outputVideoName)
      continue
    }

    console.log('\t已完成 -', outputVideoName)
  }

  console.log('已完成所有任務。')
}
