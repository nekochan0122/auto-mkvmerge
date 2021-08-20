import { config } from '../config'

/**
 * @function checkSameName 檢查檔名(以影片檔名匹配字幕)
 * @param videosName 影片檔名
 * @param subtitlesName 字幕檔名
 * @returns 返回檔名完是否完全一致
 */
export const checkSameName = (videosName: string[], subtitlesName: string[], videoExt: string): boolean => {
  video: for (const video of videosName) {
    for (const subtitle of subtitlesName) {
      if (subtitle.replace(config.subtitleExt, '') === video.replace(videoExt, '')) continue video
    }

    console.log(`請檢查 ${video} 與字幕檔名是否完全一致。`)
    return false
  }

  return true
}
