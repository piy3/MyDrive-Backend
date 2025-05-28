import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createFolder, getFolders, updateFolderName } from '../Controllers/folder.controller.js';

const FolderRouter = express.Router(); 

FolderRouter.post('/createFolder',verifyJWT, createFolder);
FolderRouter.get('/getFolders',verifyJWT,getFolders);
FolderRouter.put('/updateFolder',verifyJWT,updateFolderName);

export {FolderRouter}