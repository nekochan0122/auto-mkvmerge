"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.input = void 0;
const readline_1 = require("readline");
// 輸入介面實例
const rl = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout,
});
/**
 * @function input 用戶輸入
 * @param text 提示用戶輸入內容
 * @returns 返回用戶輸入的字符串
 */
const input = (text) => new Promise(res => {
    rl.question(`${text}\n`, path => {
        res(path);
    });
});
exports.input = input;
