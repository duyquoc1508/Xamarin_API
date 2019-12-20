const sharp = require('sharp');
const _fit = sharp.fit;
const uuidv4 = require('uuid').v4;
const resolve = require('path').resolve;

class Resize {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(750, null, {
        fit: _fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);

    return filename;
  }
  static filename() {
    // random file name
    return `${uuidv4()}.png`;
  }
  filepath(filename) {
    return resolve(`${this.folder}/${filename}`)
  }
}
module.exports = Resize;