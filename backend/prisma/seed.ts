import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const quiz = await prisma.quiz.create({
    data: {
      title: "Sample General Knowledge Quiz",
    },
  });

  const q1 = await prisma.question.create({
    data: {
      quizId: quiz.id,
      type: QuestionType.BOOLEAN,
      prompt: "The Pacific Ocean is the largest ocean on Earth.",
      order: 0,
    },
  });

  await prisma.booleanAnswer.create({
    data: { questionId: q1.id, answer: true },
  });

  const q2 = await prisma.question.create({
    data: {
      quizId: quiz.id,
      type: QuestionType.INPUT,
      prompt: "What planet is known as the Red Planet?",
      order: 1,
    },
  });

  await prisma.inputAnswer.create({
    data: { questionId: q2.id, answer: "Mars" },
  });

  const q3 = await prisma.question.create({
    data: {
      quizId: quiz.id,
      type: QuestionType.CHECKBOX,
      prompt: "Select all prime numbers below.",
      order: 2,
    },
  });

  await prisma.checkboxOption.createMany({
    data: [
      { questionId: q3.id, text: "2", order: 0, isCorrect: true },
      { questionId: q3.id, text: "4", order: 1, isCorrect: false },
      { questionId: q3.id, text: "5", order: 2, isCorrect: true },
    ],
  });
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
