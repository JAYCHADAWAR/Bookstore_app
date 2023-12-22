const multer  = require('multer');

const storage = multer.diskStorage({
   
    destination: function (req, file, cb) {
        if(file)
          cb(null, './public')
    },
    filename: function (req, file, cb) {
        if(file){
             console.log(file.originalname);
             cb(null, file.originalname)
        }
    }
  })
  
  const upload = multer({ storage: storage })
  module.exports = upload;