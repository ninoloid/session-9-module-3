import { Request, Response } from "express";
import prismaClient from "../../../../config/db/prisma.db";

export const getArticles = async (req: Request, res: Response) => {
  try {
    const userArticles = await prismaClient.article.findMany();

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: userArticles,
    });
  } catch (error: any) {
    console.log(
      "@@@ getArticles of admin role error :",
      error.message || error
    );
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};
