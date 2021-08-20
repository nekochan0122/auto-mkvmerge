"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMkvmerge = void 0;
const path_1 = require("path");
const child_process_1 = require("child_process");
const config_1 = require("../config");
const runMkvmerge = (neko) => {
    console.log('開始封裝：');
    for (let video of neko.videosName) {
        const videoPath = path_1.resolve(neko.basePath, video); // 影片路徑源
        const subtitleCmd = `--language 0:${config_1.config.subLang} "${path_1.resolve(neko.basePath, video.replace(neko.videoExt, config_1.config.subtitleExt))}"`; // 字幕路徑源
        const outputVideoName = video.replace(neko.videoExt, config_1.config.videoOutputExt); // 輸出影片檔名
        const outputPath = path_1.resolve(neko.basePath, config_1.config.outputPath, outputVideoName); // 輸出影片路徑
        const audioName = neko.audiosName.find(audio => video.replace(neko.videoExt, '') === audio.replace(config_1.config.audioExt, '')); // 返回與當前影片跟某個音軌同名，返回該音軌檔名否則返回 undefined
        const audioCmd = audioName ? `--language 1:ja "${path_1.resolve(neko.basePath, audioName)}"` : ''; // 音軌路徑
        try {
            child_process_1.execSync(`mkvmerge -o "${outputPath}" "${videoPath}" ${neko.fontsCmd} ${subtitleCmd} ${audioCmd} --track-order 0:0,0:1`);
        }
        catch (error) {
            console.log(error);
            console.log('\t發生錯誤 -', outputVideoName);
            continue;
        }
        console.log('\t已完成 -', outputVideoName);
    }
    console.log('已完成所有任務。');
};
exports.runMkvmerge = runMkvmerge;
