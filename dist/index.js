"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("readline");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const path_1 = require("path");
// 設定區
const config = {
    videoExtArray: ['.mkv', '.mp4'],
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
            return res(null); // 防止 basePath 為 null
        // 讀取資料夾裡的檔案
        let files; // 檔案
        try {
            files = fs_1.readdirSync(basePath);
        }
        catch (error) {
            console.log(error);
            console.log(`請檢查 ${basePath} 路徑是否存在。`);
            return res(null);
        }
        // 獲取 影片檔名 與 影片副檔名 和 字幕檔名
        const subtitles = filesFilter(files, config.subtitleExt);
        let videos = null;
        let videoExt = null;
        for (const fVideoExt of config.videoExtArray) {
            videos = filesFilter(files, fVideoExt);
            // 如果當前的副檔名找到檔案
            if (videos.length) {
                videoExt = fVideoExt;
                break;
            }
            else {
                videos = null;
            }
        }
        // 如果影片或字幕不存在
        if (videoExt === null || videos === null || !subtitles.length) {
            console.log('影片或字幕不存在。');
            return res(null);
        }
        // 檢查影片與字幕長度
        if (videos.length !== subtitles.length) {
            console.log('請檢查影片與字幕數量是否完全一致。');
            return res(null);
        }
        // 檢查檔名(以影片檔名匹配字幕)
        video: for (const video of videos) {
            for (const subtitle of subtitles) {
                if (subtitle.replace(config.subtitleExt, '') === video.replace(videoExt, ''))
                    continue video;
            }
            console.log(`請檢查 ${video} 與字幕檔名是否完全一致。`);
            return res(null);
        }
        // 獲取所有字體陣列
        let fonts; // 字體
        try {
            fonts = fs_1.readdirSync(path_1.resolve(basePath, config.fonts));
        }
        catch (error) {
            console.log(error);
            console.log(`請檢查 ${config.fonts} 資料夾是否存在。`);
            return res(null);
        }
        // 根據字體陣列處理字體參數
        let fontResult = ' '; // 字體指令參數
        for (let font of fonts) {
            const ext = font.split('.').pop()?.toLowerCase();
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
            const subtitlePath = path_1.resolve(basePath, video.replace(videoExt, config.subtitleExt));
            const outputVideoName = video.replace(videoExt, config.videoOutputExt);
            const outputPath = path_1.resolve(basePath, config.output, outputVideoName);
            try {
                child_process_1.execSync(`mkvmerge -o "${outputPath}" "${videoPath}" --language 0:${config.subLang} "${subtitlePath}" ${fontResult}`);
            }
            catch (error) {
                console.log(error);
                console.log('發生錯誤：', outputVideoName);
                continue;
            }
            console.log('已完成 :', outputVideoName);
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
