import { readdirSync } from 'fs'
import { resolve } from 'path'

/**
 * @function loadFiles 讀取 basePath 路徑下的所有檔案
 * @param basePath 目標路徑
 * @param path 相對路徑(可選)
 * @returns 返回讀取到的檔案路徑
 */
export const loadFiles = (basePath: string, path = ''): Promise<string[]> =>
  new Promise(res => {
    try {
      return res(readdirSync(resolve(basePath, path)))
    } catch (error) {
      console.log(error)
      return res([])
    }
  })
