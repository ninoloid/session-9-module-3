import { Router } from "express";
import { getArticles } from "../handler/article.handler";
import authorizationMiddleware from "../../../../common/middleware/authorization.middleware";
import authenticationMiddleware from "../../../../common/middleware/authentication.middleware";

const adminArticleRoutes = Router();

adminArticleRoutes.get(
  "/articles",
  authenticationMiddleware,
  authorizationMiddleware,
  getArticles
);

export default adminArticleRoutes;
