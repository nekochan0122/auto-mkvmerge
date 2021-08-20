import { config } from '../config'
import { filesFilter } from './filesFilter'

/**
 * @function videosFilter 過濾影片，支援多個副檔名
 * @param filesName 所有檔案
 * @return { videosName, videoExt } 影片檔名, 影片副檔名
 * 如果之後要讓讀取字幕支援多個檔名，可以從此函式修改
 */
export const videosFilter = (filesName: string[]): { videosName: string[]; videoExt: string } => {
  // 獲取 影片檔名 與 影片副檔名 和 字幕檔名
  for (const videoExt of config.videoExtArray) {
    const videosName = filesFilter(filesName, videoExt)

    // 如果當前的副檔名找到檔案
    if (videosName.length) {
      return { videosName, videoExt }
    }
  }

  return { videosName: [], videoExt: '' }
}
