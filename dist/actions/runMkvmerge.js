"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMkvmerge = void 0;
const path_1 = require("path");
const child_process_1 = require("child_process");
const config_1 = require("../config");
const runMkvmerge = neko => {
    console.log('開始封裝：');
    for (let video of neko.videosName) {
        const videoPath = path_1.resolve(neko.basePath, video);
        const subtitlePath = path_1.resolve(neko.basePath, video.replace(neko.videoExt, config_1.config.subtitleExt));
        const outputVideoName = video.replace(neko.videoExt, config_1.config.videoOutputExt);
        const outputPath = path_1.resolve(neko.basePath, config_1.config.outputPath, outputVideoName);
        try {
            child_process_1.execSync(`mkvmerge -o "${outputPath}" "${videoPath}" --language 0:${config_1.config.subLang} "${subtitlePath}" ${neko.fontsCmd}`);
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
