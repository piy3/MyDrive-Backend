import mongoose,{Schema} from "mongoose";

const folderSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    ownerId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        requried:true,
        index:true
    },
    parentFolder:{
        type:Schema.Types.ObjectId,
        ref:"Folder",
        default:null,
        index:true
    },
},{timestamps:true});

export const Folder = mongoose.model("Folder",folderSchema);