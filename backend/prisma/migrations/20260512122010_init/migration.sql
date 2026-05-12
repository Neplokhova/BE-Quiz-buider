CREATE TYPE "QuestionType" AS ENUM ('BOOLEAN', 'INPUT', 'CHECKBOX');

CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BooleanAnswer" (
    "questionId" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL,

    CONSTRAINT "BooleanAnswer_pkey" PRIMARY KEY ("questionId")
);

CREATE TABLE "InputAnswer" (
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "InputAnswer_pkey" PRIMARY KEY ("questionId")
);

CREATE TABLE "CheckboxOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "CheckboxOption_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Quiz_deletedAt_idx" ON "Quiz"("deletedAt");

CREATE INDEX "Question_quizId_idx" ON "Question"("quizId");

CREATE INDEX "CheckboxOption_questionId_idx" ON "CheckboxOption"("questionId");

ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BooleanAnswer" ADD CONSTRAINT "BooleanAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InputAnswer" ADD CONSTRAINT "InputAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CheckboxOption" ADD CONSTRAINT "CheckboxOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
