const commentmodel = require("../model/commentmodel");
const postmodel = require("../model/postmodel");
const Joi = require("joi");

exports.createPost = async (req, res, next) => {
  res.render("pages/newpost", {
    error: "",
  });
};

exports.createPostProcess = async (req, res, next) => {
  try {
    const { user } = req.session;
    const { title, description, name } = req.body;

    const schema = Joi.object({
      title: Joi.string().min(3).max(50).required(),
      description: Joi.string().min(3).max(50).required(),
    });

    const result = schema.validate(req.body);

    if (result.error)
      return res.render("pages/newpost", {
        error: result.error.details[0].message,
      });

    await postmodel.create({ postBy: user, title, description });
    res.redirect("/allpost");
  } catch (error) {
    next(error);
  }
};

exports.fetchAllPost = async (req, res, next) => {
  try {
    // const findPost = await postmodel
    //   .find({ isDeleted: false })
    //   .sort({ _id: -1 });
    const findComment = await commentmodel.find({ isDeleted: false });


    const query =  postmodel.find({ isDeleted : false}).sort({_id :-1});
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;
    const skip = (page - 1) * limit;
    const count = await postmodel.countDocuments({isDeleted : false});
        
    const posts = await query.skip(skip).limit(limit);


    res.render("pages/allpost", {
      posts: posts,
      comments: findComment,
      current : page,
      pages : Math.ceil(count / limit)
      

    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await postmodel.findByIdAndUpdate(id, { isDeleted: true });
    res.redirect("/allpost");
  } catch (error) {
    next(error);
  }
};

exports.editPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postmodel.findById(id, { isDeleted: false });
    res.render("pages/editpost", {
      error: "",
      posts: post,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const schema = Joi.object({
      title: Joi.string().min(2).max(50).required(),
      description: Joi.string().min(10).max(50).required(),
    });
    const result = schema.validate(req.body);
    const post = await postmodel.findById(id, { isDeleted: false });
    if (result.error)
      return res.render("pages/editpost", {
        error: result.error.details[0].message,
        posts: post,
      });
    await postmodel.findByIdAndUpdate(id, { title, description });
    res.redirect("/allpost");
  } catch (error) {
    next(error);
  }
};
