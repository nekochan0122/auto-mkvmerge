"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("readline");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const path_1 = require("path");
// 設定區
const config = {
    videoExt: '.mkv',
    videoOutputExt: '.mkv',
    subtitleExt: '.ass',
    subLang: 'zh-TW',
    fonts: 'Fonts/',
    output: 'Merges/', // 合併輸出目錄（相對）
};
// 目標路徑
let basePath = null;
// 輸入介面實例
const rl = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// loopAction
async function loopAction() {
    await inputPath();
    await main();
    loopAction();
}
// 提示輸入
function inputPath() {
    return new Promise(res => {
        rl.question('請輸入目標路徑 (不帶引號) :\n', path => {
            basePath = path;
            res(null);
        });
    });
}
// 核心函式
function main() {
    return new Promise(res => {
        if (basePath === null)
            return; // 防止 basePath 為 null
        let files; // 檔案
        let videos; // 影片
        let subtitles; // 字幕
        let fonts; // 字體
        let fontResult = ' '; // 字體指令參數
        // 讀取資料夾
        try {
            files = fs_1.readdirSync(basePath);
        }
        catch (error) {
            // 處理 error
            console.error(error);
            return console.log('請檢察目標路徑格式是否正確。');
        }
        // 獲取影片與字幕檔名
        videos = filesFilter(files, config.videoExt);
        subtitles = filesFilter(files, config.subtitleExt);
        // 如果影片或字幕不存在
        if (!videos.length || !subtitles.length)
            return console.log('影片或字幕不存在。');
        // 檢查影片與字幕長度
        if (videos.length !== subtitles.length)
            return console.log('請檢察影片與字幕數量是否完全一致。');
        // 檢查檔名(以影片檔名匹配字幕)
        video: for (let video of videos) {
            for (let subtitle of subtitles) {
                if (subtitle.replace(config.subtitleExt, '') === video.replace(config.videoExt, ''))
                    continue video;
            }
            return console.log(`請檢察 ${video} 與字幕檔名是否完全一致。`);
        }
        // 獲取所有字體陣列
        fonts = fs_1.readdirSync(path_1.resolve(basePath, config.fonts));
        // 根據字體陣列處理字體參數
        for (let font of fonts) {
            const ext = font.split('.').pop();
            // 處理 mime-type
            switch (ext) {
                case 'otf':
                    fontResult += `--attachment-mime-type font/otf`;
                    break;
                case 'ttf':
                    fontResult += `--attachment-mime-type font/ttf`;
                    break;
                case 'ttc':
                    fontResult += `--attachment-mime-type font/collection`;
                    break;
            }
            fontResult += ` --attach-file "${path_1.resolve(basePath, config.fonts)}\\${font}" `;
        }
        // 開始執行 mkvmerge
        for (let video of videos) {
            const videoPath = path_1.resolve(basePath, video);
            const subtitlePath = path_1.resolve(basePath, video.replace(config.videoExt, config.subtitleExt));
            const outputPath = path_1.resolve(basePath, config.output, video.replace(config.videoExt, config.videoOutputExt));
            child_process_1.execSync(`mkvmerge -o "${outputPath}" "${videoPath}" --language 0:${config.subLang} "${subtitlePath}" ${fontResult}`);
            console.log('已完成 :', video.replace(config.videoExt, config.videoOutputExt));
        }
        // 重置目標路徑
        basePath = null;
        console.log('已完成所有任務。');
        res(null);
    });
}
function filesFilter(files, ext) {
    return files.filter(file => file.endsWith(ext));
}
loopAction();
