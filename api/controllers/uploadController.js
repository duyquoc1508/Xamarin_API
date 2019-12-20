const resize = require('../../helper/resize');
const path = require('path');
const fs = require('fs');

module.exports = {
  uploadFile: async (req, res) => {
    try {
      const imagePath = 'public/upload';
      const fileUpload = new resize(imagePath);
      if (!req.file) {
        res.status(400).send({ message: 'Please provide an image' })
      }
      const filename = await fileUpload.save(req.file.buffer);
      return res.status(201).json({ image_name: filename });
    }
    catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },

  deleteFile: async (req, res) => {
    try {
      const imagePath = path.join(__dirname, `../../../public/upload/${req.body.filename}`);
      // res.json({file: imagePath})
      await fs.unlinkSync(imagePath)
      return res.status(200).json({
        message: "remove file successfully",
        file: imagePath
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}
