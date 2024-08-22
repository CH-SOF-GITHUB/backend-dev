const express = require('express')

const Scategorie = require('../models/scategorie')

const router = express.Router()

// méthode POST
router.post('/', async (req, res) => {
  const { nomscategorie, imagescategorie, categorieID } = req.body
  const newScategorie = new Scategorie({
    nomscategorie: nomscategorie,
    imagescategorie: imagescategorie,
    categorieID: categorieID
  })
  try {
    await newScategorie.save()
    res
      .status(200)
      .json({ newScategorie, message: 'Sous categorie ajoutée avec succès' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// méthode GET
router.get('/', async (req, res) => {
  // retour tableau
  // populate : jointure 1.1 , 1.*
  try {
    const scategories = await Scategorie.find({}, null, { sort: { '_id': -1 }}).populate('categorieID')
    res.status(200).json(scategories)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// méthode DELETE
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    await Scategorie.findByIdAndDelete(id)
    res.json({ message: 'sous categorie supprimée avec succès' })
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
    const scat = await Scategorie.findById(req.params.id)
    res.status(200).json(scat)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// méthode PUT
// modifier une catégorie
router.put('/:scategorieId', async (req, res) => {
  try {
    const scat1 = await Scategorie.findByIdAndUpdate(
      req.params.scategorieId,
      { $set: req.body },
      { new: true }
    )
    res
      .status(200)
      .json({ scat1, message: 'sous categorie modifiée avec succès' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

module.exports = router