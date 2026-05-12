import { QuestionType } from "@prisma/client";
import { HttpError } from "../lib/errors";
import { QuizRepository } from "../repositories/quiz.repository";
import { CreateQuizInput } from "../validators/quiz.schemas";

type ApiQuestion =
  | { id: string; type: "boolean"; prompt: string; answer: boolean }
  | { id: string; type: "input"; prompt: string; answer: string }
  | {
      id: string;
      type: "checkbox";
      prompt: string;
      options: Array<{ id: string; text: string; isCorrect: boolean }>;
    };

export class QuizService {
  constructor(private readonly quizRepository: QuizRepository) {}

  async createQuiz(payload: CreateQuizInput) {
    const quiz = await this.quizRepository.create(payload);
    return this.mapQuizDetail(quiz);
  }

  async listQuizzes() {
    const quizzes = await this.quizRepository.listActive();
    return quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionsCount: quiz._count.questions,
      createdAt: quiz.createdAt.toISOString(),
    }));
  }

  async getQuizById(id: string) {
    const quiz = await this.quizRepository.findActiveById(id);
    if (!quiz) {
      throw new HttpError(404, "QUIZ_NOT_FOUND", "Quiz not found");
    }

    return this.mapQuizDetail(quiz);
  }

  async softDeleteQuiz(id: string) {
    const result = await this.quizRepository.softDelete(id);
    if (result.count === 0) {
      throw new HttpError(404, "QUIZ_NOT_FOUND", "Quiz not found");
    }
  }

  private mapQuizDetail(quiz: {
    id: string;
    title: string;
    createdAt: Date;
    questions: Array<{
      id: string;
      type: QuestionType;
      prompt: string;
      booleanAnswer: { answer: boolean } | null;
      inputAnswer: { answer: string } | null;
      options: Array<{ id: string; text: string; isCorrect: boolean }>;
    }>;
  }) {
    const questions: ApiQuestion[] = quiz.questions.map((question) => {
      if (question.type === "BOOLEAN") {
        return {
          id: question.id,
          type: "boolean",
          prompt: question.prompt,
          answer: question.booleanAnswer?.answer ?? false,
        };
      }

      if (question.type === "INPUT") {
        return {
          id: question.id,
          type: "input",
          prompt: question.prompt,
          answer: question.inputAnswer?.answer ?? "",
        };
      }

      return {
        id: question.id,
        type: "checkbox",
        prompt: question.prompt,
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      };
    });

    return {
      id: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt.toISOString(),
      questions,
    };
  }
}
