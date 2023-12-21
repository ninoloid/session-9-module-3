import { Request, Response } from "express";
import { object, string } from "yup";
import { compare, hash } from "../../../common/helpers/bcrypt.helper";
import prismaClient from "../../../config/db/prisma.db";
import { sign } from "jsonwebtoken";
import { generateToken } from "../../../common/helpers/jwt.helper";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export const registerSchema = object({
  body: object({
    username: string()
      .min(6, "Minimum length of username is 6")
      .max(30, "Maximum length of username is 30")
      .required("Username is required"),
    email: string().email("Invalid email format").required("Email is required"),
    password: string()
      .min(6, "Minimum length of password is 6")
      .max(16, "Maximum length of password is 16")
      .required("Password is required"),
  }),
});

export const register = async (req: Request, res: Response) => {
  try {
    const payload: RegisterPayload = {
      ...req.body,
      password: hash(req.body.password),
    };

    const { email, username } = payload;

    const userByUsername = await prismaClient.user.findUnique({
      where: { username },
    });

    if (userByUsername) {
      return res.status(409).json({
        code: 409,
        message: `User with username ${username} already exists`,
      });
    }

    const userByEmail = await prismaClient.user.findUnique({
      where: { email },
    });

    if (userByEmail) {
      return res.status(409).json({
        code: 409,
        message: `User with email ${email} already exists`,
      });
    }

    await prismaClient.user.create({
      data: payload,
    });

    return res.status(201).json({
      code: 201,
      message: `User ${req.body.username} created successfully`,
    });
  } catch (error: any) {
    console.log("@@@ getBranchById error :", error.message || error);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    return res.status(400).json({
      code: 400,
      message: "Username or email and password cannot be empty",
    });
  }

  const condition: { username?: string; email?: string } = {};

  if (username) {
    condition.username = username;
  }

  if (email) {
    condition.email = email;
  }

  const user = await prismaClient.user.findFirst({
    where: condition,
  });

  if (!user) {
    return res.status(404).json({
      code: 404,
      message: "User not found",
    });
  }

  const isValidUserPassword = compare(password, user.password);

  if (!isValidUserPassword) {
    return res.status(400).json({
      code: 400,
      message: "Invalid username or password",
    });
  }

  const generatedToken = generateToken(user);

  return res.status(200).json({
    code: 200,
    message: "Success",
    data: {
      token: generatedToken,
    },
  });
};
