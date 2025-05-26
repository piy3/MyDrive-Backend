import mongoose, {Schema} from "mongoose";

const fileSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    url:{
        type:String, //cloudinary or other url for file
        required:true
    },
    ownerId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    folderId:{
        type:Schema.Types.ObjectId | null,
        ref:"Folder",
        default: null,
        index:true
    }
    //*can add feature ,to "give a tag" to the files to help user filter out files based on his/her tags
},{timestamps:true});

export const File = mongoose.model("File",fileSchema);