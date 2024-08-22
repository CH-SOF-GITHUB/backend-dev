const express = require('express')

const Article = require('../models/article')

const router = express.Router()

// verify token for login
const verifyToken = require('../routes/middleware/verify-token');

// méthode POST
router.post('/', async (req, res) =>  {  
    const nouvarticle = new Article(req.body) 
    try { 
        const response =await nouvarticle.save(); 
        const articles = await Article.findById(response._id).populate("scategorieID").exec(); 
        res.status(200).json({articles, message: "Article enregistrée avec succès"}); 
    } catch (error) { 
        res.status(404).json({ message: error.message }); 
    } 
});

// méthode GET: afficher la liste des articles
router.get('/', verifyToken ,async (req, res) => {
  // retour tableau
  try {
    const articles = await Article.find({}, null, { sort: { '_id': -1 } }).populate("scategorieID");
    res.status(200).json(articles)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

//méthode GET par pagination
router.get('/art/pagination', async (req, res) => {

  const filtre = req.query.filtre || "";
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);

  //calculate the start and end indexes for the requested page
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const articles = await Article.find({designation:{$regex: filtre, $options: "i"}}, null, {sort: {'_id': -1}}).populate("scategorieID").exec()
  //Slice the products array based on the indexes

  const paginatedProducts = articles.slice(startIndex, endIndex);

  // calculate the number total of pages
  const totalPages = Math.ceil(articles.length / pageSize);

  // Send the paginated products and total pages
  res.json({ products: paginatedProducts, totalPages }); 
})

// méthode DELETE
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    await Article.findByIdAndDelete(id)
    res.json({ message: 'Article supprimée avec succès' })
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
    const cat = await Article.findById(req.params.id)
    res.status(200).json({ cat, message: 'Article trouvée avec succès' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// méthode PUT
// modifier une catégorie
router.put('/:articleId', async (req, res) => {
  try {
    const cat1 = await Article.findByIdAndUpdate(
      req.params.articleId,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json({ cat1, message: 'Article modifiée avec succès' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

module.exports = router
