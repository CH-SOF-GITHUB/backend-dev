const express = require('express')

const Categorie = require('../models/categorie')

const router = express.Router()

//
const verifyToken = require('../routes/middleware/verify-token');
const authorizeRoles = require('../routes/middleware/authorizeRoles');


// méthode POST
// async pourquoi: pour envoyer les données à la base de données, 
// il termine et enregistre par suite passe au 2 éme requete
router.post('/', verifyToken, authorizeRoles("admin", "visiteur") , async (req, res) => {
  const { nomcategorie, imagecategorie } = req.body
  const newCategorie = new Categorie({
    nomcategorie: nomcategorie,
    imagecategorie: imagecategorie
  })
  try {
    await newCategorie.save()
    res
      .status(200)
      .json({ newCategorie, message: 'Categorie ajoutée avec succès' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// méthode GET
router.get('/', async (req, res) => {
  // retour tableau
  try {
    const categories = await Categorie.find({}, null, { sort: { '_id': -1 } })
    res.status(200).json(categories)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// méthode DELETE
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    await Categorie.findByIdAndDelete(id)
    res.json({ message: 'Categorie supprimée avec succès' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
  /*try {
    const category = await Categorie.find({"_id": req.params.id});
    res.status(200).Categorie.delete(category);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }*/
})
// méthode FindById

router.get('/:id', async (req, res) => {
  try {
    const cat = await Categorie.findById(req.params.id)
    res.status(200).json({ cat, message: 'Categorie trouvée avec succès' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// méthode PUT
// modifier une catégorie
router.put('/:categorieId', async (req, res) => {
  try {
    const cat1 = await Categorie.findByIdAndUpdate(
      req.params.categorieId,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json({ cat1, message: 'categorie modifiée avec succès' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

module.exports = router
