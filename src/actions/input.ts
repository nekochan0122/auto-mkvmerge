import { createInterface } from 'readline'

// 輸入介面實例
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

/**
 * @function input 用戶輸入
 * @param text 提示用戶輸入內容
 * @returns 返回用戶輸入的字符串
 */
export const input = (text: string): Promise<string> =>
  new Promise(res => {
    rl.question(`${text}\n`, path => {
      res(path)
    })
  })
