const fs = require('fs');
const path = require('path');

module.exports.imageCategories = (req, res) => {
  const fullPath = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../../../galleryPics')
    : path.join(__dirname, '../../../public/galleryPics');
  fs.readdir(fullPath, (err, files) => {
    if (err) {
      res.status(500).send({error: "ERROR: Problem fetching images list"});
    }
    const games = files.filter(file => file.match(/(games|cubby|tower|all)/)).reverse();
    const consoles = files.filter(file => file.match(/(consoles|cubby|conshelves|all)/)).reverse();
    const collectibles = files.filter(file => file.match(/(collectibles|boxes)/)).reverse();
    const gameroom = files.filter(file => file.indexOf('gameroom') >= 0).reverse();
    const pc = files.filter(file => file.indexOf('pc') >= 0).reverse();
    const zelda = files.filter(file => file.indexOf('zelda') >= 0).reverse();
    res.status(200).json({games, consoles, collectibles, gameroom, pc, zelda});
  });
};