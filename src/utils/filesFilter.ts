/**
 * @function filesFilter 檔案過濾
 * @param files 檔案
 * @param ext 副檔名
 * @returns 從檔案過濾副檔名後的陣列
 */
export const filesFilter = (files: string[], ext: string): string[] => {
  return files.filter(file => file.endsWith(ext))
}
