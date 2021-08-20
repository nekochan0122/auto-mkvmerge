import { config } from './config'
import { Neko } from './neko'
import { input, loadFiles, checkSameName, getFontsCmd, runMkvmerge } from './actions'
import { filesFilter, videosFilter } from './utils'

// 如果 fonts.length 是空的就開始尋找字體並複製到該資料夾下

/**
 * @function loopAction 循環所有操作
 */
export const loopAction = async (): Promise<void> => {
  const neko = new Neko()

  // 輸入目標路徑
  neko.basePath = await input('請輸入目標路徑 (不帶引號) :')

  // 讀取目標路徑 的 所有檔案
  neko.filesName = await loadFiles(neko.basePath)
  if (!neko.filesName.length) {
    console.log(`請檢查 ${neko.basePath} 路徑是否存在。`)
    return loopAction()
  }

  // 從 所有檔案 過濾出字幕
  neko.subtitlesName = filesFilter(neko.filesName, config.subtitleExt)

  // 從 所有檔案 過濾出音軌
  neko.audiosName = filesFilter(neko.filesName, config.audioExt)

  // 從 所有檔案 過濾出影片
  /**
   *  !　這裡不知道為什麼不能解構賦值
   *  { neko.videoExt, neko.videosName } = videosFilter(neko.filesName)
   */
  const { videoExt, videosName } = videosFilter(neko.filesName)
  neko.videoExt = videoExt
  neko.videosName = videosName

  // 檢查影片或字幕是否存在
  if (neko.videoExt === '' || !neko.videosName.length || !neko.subtitlesName.length) {
    console.log('影片或字幕不存在。')
    return loopAction()
  }

  // 檢查影片與字幕長度
  if (neko.videosName.length !== neko.subtitlesName.length) {
    console.log('請檢查影片與字幕數量是否完全一致。')
    return loopAction()
  }

  // 檢查檔名(以影片檔名匹配字幕)
  if (!checkSameName(neko.videosName, neko.subtitlesName, neko.videoExt)) {
    console.log('請檢查所有影片檔名與所有字幕檔名是否完全一致。')
    return loopAction()
  }

  // 獲取所有字體檔名
  neko.fonts = await loadFiles(neko.basePath, config.fontsPath)

  // 字體指令參數
  if (neko.fonts.length) {
    neko.fontsCmd = getFontsCmd(neko.basePath, config.fontsPath, neko.fonts)
  } else {
    console.log('未找到任何字體，略過封裝字體。')
  }

  runMkvmerge(neko)

  loopAction()
}
