import { Router } from "express";
import authRouter from "../../modules/auth/router/auth.router";
import articleRouter from "../../modules/article/router/article.router";
import adminArticleRoutes from "../../modules/admin/article/router/article.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/admin", adminArticleRoutes);

export default apiRouter;
