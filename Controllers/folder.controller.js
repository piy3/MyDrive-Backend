import { Folder } from "../Models/folder.model.js";
import User from "../Models/user.model.js";

const createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;
    const ownerId = req.user._id; // Get the ownerId from the authenticated user

    if (!name && !ownerId) {
      return res.status(404).json({
        success: "false",
        message: "All fields are required",
      });
    }
    //validate if ownerId and parentFolder exists in db
    const ownerExists = await User.findById(ownerId);
    if (!ownerExists) {
      return res.status(404).json({
        success: "false",
        message: "Owner does not exist",
      });
    }
    if (parentFolder != null) {
      const parentFolderExists = await Folder.findById(parentFolder);
      if (!parentFolderExists) {
        return res.status(404).json({
          success: "false",
          message: "Parent folder does not exist",
        });
      }
    }

    const folder = await Folder.create({
      name,
      ownerId,
      parentFolder,
    });
    return res.status(200).json({
      success: "true",
      message: "Folder created successfully",
      folder,
    });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      message: err,
    });
  }
};

const getFolders = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const  parentFolder  = req.body?.parentFolder ||  null;
    if (!ownerId) {
      return res.status(404).json({
        success: "false",
        message: "OwnerId is required",
      });
    }
    const folders = await Folder.find({ ownerId, parentFolder })
      .populate("ownerId", "fullname email")
      .populate("parentFolder", "name");
    if (folders.length === 0) {
      return res.status(404).json({
        success: "false",
        message: "No folders found",
      });
    }
    return res.status(200).json({
      success: "true",
      message: "Folders retrieved successfully",
      folders,
    });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      message: err,
    });
  }
};

const updateFolderName = async(req,res)=>{
    const {folderId, newName} = req.body;
    if(!folderId || !newName){
        return res.status(400).json({
            success: "false",
            message: "Folder ID and new name are required"
        });
    }
    try{
        const folder = await Folder.findByIdAndUpdate(folderId, { name: newName }, { new: true }); 
        if (!folder) {
            return res.status(404).json({
                success: "false",
                message: "Folder not found"
            });
        }
        return res.status(200).json({
            success: "true",
            message: "Folder name updated successfully",
            folder
        });
    }
    catch(err){
        return res.status(500).json({
            success: "false",
            message: err.message || "Internal server error"
        });
    }
}

export { createFolder, getFolders , updateFolderName };
