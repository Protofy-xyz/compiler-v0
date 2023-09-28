import {app} from '../lib/app';
import { handler } from '../lib/handler';
import * as fs from 'fs';
import { getDatabases } from './databases';
import { WorkspaceModel } from 'common';

app.get('/adminapi/v1/workspaces', handler(async (req, res) => {
    const dbs = await getDatabases()
    const workspaceRawData = JSON.parse((await fs.promises.readFile('../../data/workspaces/basic.json')).toString())
    const workspace = WorkspaceModel.parse(workspaceRawData, dbs, fs)
    res.send(workspace)
}));
