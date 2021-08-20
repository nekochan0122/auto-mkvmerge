"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesFilter = void 0;
/**
 * @function filesFilter 檔案過濾
 * @param files 檔案
 * @param ext 副檔名
 * @returns 從檔案過濾副檔名後的陣列
 */
const filesFilter = (filesName, ext) => {
    return filesName.filter(file => file.endsWith(ext));
};
exports.filesFilter = filesFilter;
