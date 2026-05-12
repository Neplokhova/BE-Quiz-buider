import { Prisma, PrismaClient } from "@prisma/client";
import { CreateQuizInput } from "../validators/quiz.schemas";

const quizDetailInclude = {
  questions: {
    orderBy: { order: "asc" as const },
    include: {
      booleanAnswer: true,
      inputAnswer: true,
      options: { orderBy: { order: "asc" as const } },
    },
  },
} satisfies Prisma.QuizInclude;

export class QuizRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(payload: CreateQuizInput) {
    return this.db.$transaction(async (tx) => {
      const quiz = await tx.quiz.create({
        data: { title: payload.title.trim() },
      });

      for (const [index, question] of payload.questions.entries()) {
        const createdQuestion = await tx.question.create({
          data: {
            quizId: quiz.id,
            type: question.type.toUpperCase() as Prisma.QuestionType,
            prompt: question.prompt.trim(),
            order: index,
          },
        });

        if (question.type === "boolean") {
          await tx.booleanAnswer.create({
            data: { questionId: createdQuestion.id, answer: question.answer },
          });
          continue;
        }

        if (question.type === "input") {
          await tx.inputAnswer.create({
            data: { questionId: createdQuestion.id, answer: question.answer.trim() },
          });
          continue;
        }

        await tx.checkboxOption.createMany({
          data: question.options.map((option, optionIndex) => ({
            questionId: createdQuestion.id,
            text: option.text.trim(),
            order: optionIndex,
            isCorrect: option.isCorrect,
          })),
        });
      }

      return tx.quiz.findUniqueOrThrow({
        where: { id: quiz.id },
        include: quizDetailInclude,
      });
    });
  }

  async listActive() {
    return this.db.quiz.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: { select: { questions: true } },
      },
    });
  }

  async findActiveById(id: string) {
    return this.db.quiz.findFirst({
      where: { id, deletedAt: null },
      include: quizDetailInclude,
    });
  }

  async softDelete(id: string) {
    return this.db.quiz.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
