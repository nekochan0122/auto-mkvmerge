"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosFilter = void 0;
const config_1 = require("../config");
const filesFilter_1 = require("./filesFilter");
/**
 * @function videosFilter 過濾影片，支援多個副檔名
 * @param filesName 所有檔案
 * @return { videosName, videoExt } 影片檔名, 影片副檔名
 * 如果之後要讓讀取字幕支援多個檔名，可以從此函式修改
 */
const videosFilter = (filesName) => {
    // 獲取 影片檔名 與 影片副檔名 和 字幕檔名
    for (const videoExt of config_1.config.videoExtArray) {
        const videosName = filesFilter_1.filesFilter(filesName, videoExt);
        // 如果當前的副檔名找到檔案
        if (videosName.length) {
            return { videosName, videoExt };
        }
    }
    return { videosName: [], videoExt: '' };
};
exports.videosFilter = videosFilter;
