import { Router } from "express";
import { QuizController } from "../controllers/quiz.controller";
import { validate } from "../middlewares/validate.middleware";
import { createQuizSchema, quizIdParamsSchema } from "../validators/quiz.schemas";

export const createQuizRouter = (quizController: QuizController) => {
  const router = Router();

  router.post("/", validate(createQuizSchema), quizController.createQuiz);
  router.get("/", quizController.listQuizzes);
  router.get("/:id", validate(quizIdParamsSchema, "params"), quizController.getQuizById);
  router.delete("/:id", validate(quizIdParamsSchema, "params"), quizController.deleteQuiz);

  return router;
};
