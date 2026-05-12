import cors from "cors";
import express from "express";
import { QuizController } from "./controllers/quiz.controller";
import { prisma } from "./lib/prisma";
import { errorMiddleware } from "./middlewares/error.middleware";
import { QuizRepository } from "./repositories/quiz.repository";
import { createQuizRouter } from "./routes/quiz.routes";
import { QuizService } from "./services/quiz.service";

const quizRepository = new QuizRepository(prisma);
const quizService = new QuizService(quizRepository);
const quizController = new QuizController(quizService);

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/quizzes", createQuizRouter(quizController));
app.use(errorMiddleware);
