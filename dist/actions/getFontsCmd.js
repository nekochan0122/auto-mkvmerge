"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontsCmd = void 0;
const path_1 = require("path");
const getFontsCmd = (basePath, fontsPath, fonts) => {
    let fontResult = '';
    for (let font of fonts) {
        const ext = font.toLowerCase().split('.').pop();
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
        fontResult += ` --attach-file "${path_1.resolve(basePath, fontsPath)}\\${font}" `;
    }
    return fontResult;
};
exports.getFontsCmd = getFontsCmd;
