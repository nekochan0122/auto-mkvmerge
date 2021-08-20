"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loopAction = void 0;
const config_1 = require("./config");
const neko_1 = require("./neko");
const actions_1 = require("./actions");
const utils_1 = require("./utils");
// 如果 fonts.length 是空的就開始尋找字體並複製到該資料夾下
/**
 * @function loopAction 循環所有操作
 */
const loopAction = async () => {
    const neko = new neko_1.Neko();
    // 輸入目標路徑
    neko.basePath = await actions_1.input('請輸入目標路徑 (不帶引號) :');
    // 讀取目標路徑 的 所有檔案
    neko.filesName = await actions_1.loadFiles(neko.basePath);
    if (!neko.filesName.length) {
        console.log(`請檢查 ${neko.basePath} 路徑是否存在。`);
        return exports.loopAction();
    }
    // 從 所有檔案 過濾出字幕
    neko.subtitlesName = utils_1.filesFilter(neko.filesName, config_1.config.subtitleExt);
    // 從 所有檔案 過濾出音軌
    neko.audiosName = utils_1.filesFilter(neko.filesName, config_1.config.audioExt);
    // 從 所有檔案 過濾出影片
    /**
     *  !　這裡不知道為什麼不能解構賦值
     *  { neko.videoExt, neko.videosName } = videosFilter(neko.filesName)
     */
    const { videoExt, videosName } = utils_1.videosFilter(neko.filesName);
    neko.videoExt = videoExt;
    neko.videosName = videosName;
    // 檢查影片或字幕是否存在
    if (neko.videoExt === '' || !neko.videosName.length || !neko.subtitlesName.length) {
        console.log('影片或字幕不存在。');
        return exports.loopAction();
    }
    // 檢查影片與字幕長度
    if (neko.videosName.length !== neko.subtitlesName.length) {
        console.log('請檢查影片與字幕數量是否完全一致。');
        return exports.loopAction();
    }
    // 檢查檔名(以影片檔名匹配字幕)
    if (!actions_1.checkSameName(neko.videosName, neko.subtitlesName, neko.videoExt)) {
        console.log('請檢查所有影片檔名與所有字幕檔名是否完全一致。');
        return exports.loopAction();
    }
    // 獲取所有字體檔名
    neko.fonts = await actions_1.loadFiles(neko.basePath, config_1.config.fontsPath);
    // 字體指令參數
    if (neko.fonts.length) {
        neko.fontsCmd = actions_1.getFontsCmd(neko.basePath, config_1.config.fontsPath, neko.fonts);
    }
    else {
        console.log('未找到任何字體，略過封裝字體。');
    }
    actions_1.runMkvmerge(neko);
    exports.loopAction();
};
exports.loopAction = loopAction;
