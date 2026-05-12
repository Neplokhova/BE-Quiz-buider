import { Request, Response } from "express";
import { QuizService } from "../services/quiz.service";
import { CreateQuizInput } from "../validators/quiz.schemas";

export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  createQuiz = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as CreateQuizInput;
    const quiz = await this.quizService.createQuiz(payload);
    res.status(201).json(quiz);
  };

  listQuizzes = async (_req: Request, res: Response): Promise<void> => {
    const quizzes = await this.quizService.listQuizzes();
    res.status(200).json(quizzes);
  };

  getQuizById = async (req: Request, res: Response): Promise<void> => {
    const quiz = await this.quizService.getQuizById(req.params.id);
    res.status(200).json(quiz);
  };

  deleteQuiz = async (req: Request, res: Response): Promise<void> => {
    await this.quizService.softDeleteQuiz(req.params.id);
    res.status(204).send();
  };
}
