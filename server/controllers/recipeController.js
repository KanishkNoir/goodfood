require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
/**
 * GET /
 * Homepage
 */

exports.homepage = async(req, res) => {

    try
    {
        const limitnumber= 5;
        const categories= await Category.find({}).limit(limitnumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitnumber);
        const american = await Recipe.find({'category': 'American'}).limit(limitnumber);
        const italian = await Recipe.find({'category': 'Italian'}).limit(limitnumber);
        const indian = await Recipe.find({'category': 'Indian'}).limit(limitnumber);
        const french = await Recipe.find({'category': 'French'}).limit(limitnumber);
        const japanese = await Recipe.find({'category': 'Japanese'}).limit(limitnumber);
        const thai = await Recipe.find({'category': 'Thai'}).limit(limitnumber);
        const greek = await Recipe.find({'category': 'Greek'}).limit(limitnumber);
        const chinese = await Recipe.find({'category': 'Chinese'}).limit(limitnumber);
        const food = { latest, american, italian, indian, thai, japanese, french, greek, chinese };

        res.render('index', {title: 'Cooking Blog- Home', categories, food });
    } catch(error)
    {
        res.status(500).send({message: error.message || "Error Occured"})
    }
}


/**
 * GET /
 * Categories
 */

 exports.exploreCategories = async(req, res) => {

    try
    {
        const limitnumber= 20;
        const categories= await Category.find({}).limit(limitnumber);
        res.render('categories', {title: 'Cooking Blog- Categories', categories});
    } catch(error)
    {
        res.status(500).send({message: error.message || "Error Occured"})
    }
}


/**
 * GET /
 * Categories By ID
 */
exports.exploreCategoriesById = async(req, res) => {

  try
  {
    let categoryId =req.params.id;
      const limitnumber= 20;
      const categoryById= await Recipe.find({ 'category': categoryId}).limit(limitnumber);
      res.render('categories', {title: 'Cooking Blog- Categories', categoryById});
  } catch(error)
  {
      res.status(500).send({message: error.message || "Error Occured"})
  }
}

/**
 * GET /
 * Recipes
 */

 exports.exploreRecipes = async(req, res) => {

  try
  {
    let recipeID = req.params.id;
    const recipe = await Recipe.findById(recipeID);
      
      res.render('recipe', {title: 'Cooking Blog- Recipe', recipe});
  } catch(error)
  {
      res.status(500).send({message: error.message || "Error Occured"})
  }
}

/**
 * POST/search
 * Search
 */

 exports.searchRecipe = async(req, res) => {
    try
    {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find({$text: {$search: searchTerm, $diacriticSensitive: true}});
      res.render('search', {title: 'Cooking Blog -Search', recipe });
    } catch(error)
    {
      res.status(500).send({message: error.message || "Error Occured"});
    }
}


/**
 * GET/explore-latest
 * Explore Latest
 */
exports.exploreLatest = async(req, res) => {
  try
  {
    const limitnumber = 20;
    const recipe = await Recipe.find({}).sort({ _id:-1}).limit(limitnumber);
    res.render('explore-latest', {title: 'Cooking Blog -Explore Latest', recipe });
  } catch(error)
  {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}

/**
 * GET/explore-latest
 * Explore Latest
 */
 exports.exploreRandom = async(req, res) => {
  try
  {
    let count = await Recipe.find().countDocuments();
    let random =Math.floor(Math.random() * count);
    let recipe =await Recipe.findOne().skip(random).exec();
    res.render('explore-random', {title: 'Cooking Blog -Explore Random', recipe });
  } catch(error)
  {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}


/**
 * GET/submit-recipe
 * Submit Recipe
 */

exports.submitRecipe = async(req, res) => {
  const infoErrorsObj =req.flash('infoErrors');
  const infoSubmitObj =req.flash('infoSubmit');
  res.render('submit-recipe', {title: 'Cooking Blog - Submit Recipe', infoErrorsObj,infoSubmitObj });
}


/**
 * POST/submit-recipe
 * Submit Recipe
 */

 exports.submitRecipeOnPost = async(req, res) => {
  try{

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No files were uploaded.');
    }else{
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath =require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })
    }
    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });

    await newRecipe.save();

  
    req.flash('infoSubmit', 'Recipe has been added.');
    res.redirect('/submit-recipe');
  } catch(error){
    
    req.flash('infoErrors', error);
    res.redirect('submit-recipe');
  }
}


/**
 * / async function updateRecipe(){
 * try{ const res =await Recipe.updateOne({ name:'Recipe Name'}, {name:'Recipe Name Updated'});
 * res.n; //Number of documents matched
 * res.nModified;
 * }
 * catch(error)
 * {
 * console.log(error);}
 * }
 * updateRecipe();
 */

/**
 * / async function deleteRecipe(){
 * try{
 * await Recipe.deleteOne({ name:'Recipe Name'});
 * }
 * catch(error)
 * {
 * console.log(error);}
 * }
 * deleteRecipe();
 */