//1. Import multer
import multer from "multer";

//2.configure storage with filename and location

const storage=multer.diskStorage({
    //configuration for destination
    destination:(req,file,cb)=>{
        cb(null,'./uploads/');
    },
    //configuration for filename
    filename: (req, file, cb) => {
        cb(
        null,
        new Date().toISOString().replace(/:/g, '_') +
        file.originalname
        )
    }
});
export const upload=multer({storage:storage});