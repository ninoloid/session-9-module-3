import { Request, Response } from "express";
import { object, string } from "yup";
import { compare, hash } from "../../../common/helpers/bcrypt.helper";
import prismaClient from "../../../config/db/prisma.db";
import { sign } from "jsonwebtoken";

export interface PostArticlePayload {
  title: string;
  content: string;
  userId: number;
}

export interface PatchArticlePayload {
  title?: string;
  content?: string;
}

export const postArticleSchema = object({
  body: object({
    title: string().required("Title is required"),
    content: string().required("Content is required"),
  }),
});

export const patchArticleSchema = object({
  body: object({
    title: string().optional(),
    content: string().optional(),
  }),
});

export const postArticle = async (req: any, res: Response) => {
  try {
    const { title, content } = req.body;
    const { userId } = req;
    const postArticlePayload: PostArticlePayload = {
      title,
      content,
      userId,
    };
    const postedAtricle = await prismaClient.article.create({
      data: postArticlePayload,
    });

    return res.status(201).json({
      code: 201,
      message: "Article created successfully",
      data: postedAtricle,
    });
  } catch (error: any) {
    console.log("@@@ postArticle error :", error.message || error);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

export const getArticles = async (req: any, res: Response) => {
  try {
    const { userId } = req;

    const userArticles = await prismaClient.article.findMany({
      where: {
        userId,
      },
    });

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: userArticles,
    });
  } catch (error: any) {
    console.log("@@@ getArticles error :", error.message || error);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

export const getArticleById = async (req: any, res: Response) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const parsedId = parseInt(id);
    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        message: "Invalid ID params",
      });
    }

    const userArticle = await prismaClient.article.findFirst({
      where: {
        id: parsedId,
        userId,
      },
    });

    if (!userArticle) {
      return res.status(404).json({
        code: 404,
        message: `Article with id ${parsedId} not found`,
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: userArticle,
    });
  } catch (error: any) {
    console.log("@@@ getArticles error :", error.message || error);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

export const patchArticleById = async (req: any, res: Response) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const { title, content } = req.body;

    const patchArticlePayload = {
      title,
      content,
    };

    const parsedId = parseInt(id);
    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        message: "Invalid ID params",
      });
    }

    const userArticle = await prismaClient.article.findFirst({
      where: {
        id: parsedId,
        userId,
      },
    });

    if (!userArticle) {
      return res.status(404).json({
        code: 404,
        message: `Article with id ${parsedId} not found`,
      });
    }

    const patchedArticle = await prismaClient.article.update({
      where: {
        id: parsedId,
      },
      data: patchArticlePayload,
    });

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: patchedArticle,
    });
  } catch (error: any) {
    console.log("@@@ getArticles error :", error.message || error);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

export const deleteArticleById = async (req: any, res: Response) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const parsedId = parseInt(id);
    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        message: "Invalid ID params",
      });
    }

    const userArticle = await prismaClient.article.findFirst({
      where: {
        id: parsedId,
        userId,
      },
    });

    if (!userArticle) {
      return res.status(404).json({
        code: 404,
        message: `Article with id ${parsedId} not found`,
      });
    }

    await prismaClient.article.delete({
      where: {
        id: parsedId,
      },
    });

    return res.status(200).json({
      code: 200,
      message: "Success",
    });
  } catch (error: any) {
    console.log("@@@ getArticles error :", error.message || error);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};
