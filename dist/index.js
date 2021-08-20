"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loopAction_1 = require("./loopAction");
const { version } = require('../package.json');
process.title = `auto-mkvmerge v${version} By NekoChan#2851 - Nyaharo ~`;
loopAction_1.loopAction();
