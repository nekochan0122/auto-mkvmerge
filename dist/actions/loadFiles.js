"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFiles = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * @function loadFiles 讀取 basePath 路徑下的所有檔案
 * @param basePath 目標路徑
 * @param path 相對路徑(可選)
 * @returns 返回讀取到的檔案路徑
 */
const loadFiles = (basePath, path = '') => new Promise(res => {
    try {
        return res(fs_1.readdirSync(path_1.resolve(basePath, path)));
    }
    catch (error) {
        console.log(error);
        return res([]);
    }
});
exports.loadFiles = loadFiles;
