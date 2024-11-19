import { Comment } from "../models/commentModel.js";
import { User } from "../models/userModel.js";

async function createComment(req, res) {
  const { userId, taskId, comment } = req.body;

  try {
    const newComment = await Comment({ userId, taskId, comment });
    await newComment.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log("Erorr while posting comment", error);
    return res.status(500).json({ msg: "Error while posting comment" });
  }
}

async function getComments(req, res) {
  const taskId = req.query.taskId;
  if (!taskId) return res.sendStatus(400);
  const response = [];
  try {
    const comments = await Comment.find({ taskId });
    if (!comments) return res.status(400).json({ msg: "No comments found" });
    await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findById(comment.userId);
        response.push({
          id: comment.id,
          userId: comment.userId,
          taskId: comment.taskId,
          userName: `${user.firstName} ${user.lastName}`,
          role: user.roleId === 1 ? "Developer" : "Team Leader",
          comment: comment.comment,
        });
      })
    );

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error while getting comments", error);
    return res.status(500).json({ msg: "Error while getting comments" });
  }
}

export { createComment, getComments };
