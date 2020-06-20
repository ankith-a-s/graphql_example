const File = require("../models/file");
const fs = require("fs");
const mime = require("mime");

async function _createFile(req, res) {
  try {
    const { base64image } = req.body
    if (!base64image) { 
      throw new Error('File not provided');
    }
    var matches = base64image.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      ),
      response = {};

    if (matches.length !== 3) {
      return new Error("Invalid input string");
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], "base64");
    const decodedImg = response;
    const imageBuffer = decodedImg.data;
    const type = decodedImg.type;
    const extension = mime.getExtension(type);
    const fileName = `image-${Math.floor(new Date() / 1000)}.` + extension;
    fs.writeFileSync("./uploads/" + fileName, imageBuffer, "utf8");
    const image = { fileName };
    const file = await File.create(image);
    return res.status(200).json({
      description: "File Upload successful",
      file
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      description: "File upload failed",
      message: error.errmsg || error.errors || error.message
    });
  }
}

async function _getFile(req, res) {
  try {
    const file = await File.findById(req.params.id);
    //  console.log(result, "result");
    if (!file) {
      res.status(404);
      return;
    }

    const path = "./uploads/" + file.fileName;
    const stream = fs.createReadStream(path);
    stream.pipe(res);
  } catch (err) {
    return res.status(400).json({
      success: false,
      description: "Fetch file failed",
      message: error.errmsg || error.errors || error.message
    });
  }
}

module.exports = {
  _getFile,
  _createFile
};
