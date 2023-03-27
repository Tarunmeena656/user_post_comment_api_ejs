const commentmodel = require("../model/commentmodel");
const Joi = require("joi");

exports.createComment = async (req, res, next) => {
  try {
    const { user } = req.session;
    const { comment, postid } = req.body;
    await commentmodel.create({ commentBy: user, commentOn: postid, comment });
    res.redirect("/allpost");
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await commentmodel.findByIdAndUpdate(id, { isDeleted: true });
    res.redirect("/allpost");
  } catch (error) {
    next(error);
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await commentmodel.findById(id);
    res.render("pages/editcomment", {
      comments: comment,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const schema = Joi.object({
      comment: Joi.string().min(3).max(50).required(),
    });
    const comments = await commentmodel.findById(id);
    const result = schema.validate(req.body);
    if (result.error)
      return res.render("pages/editcomment", {
        error: result.error.details[0].message,
        comments,
      });
    await commentmodel.findByIdAndUpdate(id, { comment });
    res.redirect("/allpost");
  } catch (error) {
    next(error);
  }
};
