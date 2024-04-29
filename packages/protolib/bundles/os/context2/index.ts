import {readFile} from './readFile'
import {writeFile} from './writeFile'
import { runCommand } from './RunCommand'
import {listDir} from './listDir'
import { makeDir } from './makeDir'
import { fileExists } from './fileExists'
import { deleteFile } from './deleteFile'
import { deleteDirectory } from './deleteDirectory'
import { renameFile } from './renameFile'
import { copyFile } from './copyFile'

export default {
    readFile,
    writeFile,
    listDir,
    runCommand,
    makeDir,
    fileExists,
    deleteFile,
    deleteDirectory,
    renameFile,
    copyFile
}