import { Router } from "express";
import { inputValidator } from "../../../common/helpers/validator.helper";
import authorizationMiddleware from "../../../common/middleware/authorization.middleware";
import {
  deleteArticleById,
  getArticleById,
  getArticles,
  patchArticleById,
  postArticle,
  postArticleSchema,
} from "../handler/article.handler";

const articleRouter = Router();

articleRouter.post(
  "/",
  authorizationMiddleware,
  inputValidator(postArticleSchema),
  postArticle
);

articleRouter.get("/", authorizationMiddleware, getArticles);
articleRouter.get("/:id", authorizationMiddleware, getArticleById);
articleRouter.patch("/:id", authorizationMiddleware, patchArticleById);
articleRouter.delete("/:id", authorizationMiddleware, deleteArticleById);

export default articleRouter;
