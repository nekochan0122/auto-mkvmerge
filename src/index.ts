import { loopAction } from './loopAction'

const { version } = require('../package.json')

process.title = `auto-mkvmerge v${version} By NekoChan#2851 - Nyaharo ~`

loopAction()
