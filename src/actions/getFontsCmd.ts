import { resolve } from 'path'

export const getFontsCmd = (basePath: string, fontsPath: string, fonts: string[]): string => {
  let fontResult = ''

  for (let font of fonts) {
    const ext = font.toLowerCase().split('.').pop()

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

    fontResult += ` --attach-file "${resolve(basePath, fontsPath)}\\${font}" `
  }

  return fontResult
}
