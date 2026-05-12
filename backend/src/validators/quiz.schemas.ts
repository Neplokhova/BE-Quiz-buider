import { z } from "zod";

const trimmedString = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

const questionBaseSchema = z.object({
  prompt: trimmedString(3, 500),
});

const booleanQuestionSchema = questionBaseSchema.extend({
  type: z.literal("boolean"),
  answer: z.boolean(),
});

const inputQuestionSchema = questionBaseSchema.extend({
  type: z.literal("input"),
  answer: trimmedString(1, 1000),
});

const checkboxOptionSchema = z.object({
  text: z.string().trim().min(1),
  isCorrect: z.boolean(),
});

const checkboxQuestionSchema = questionBaseSchema
  .extend({
    type: z.literal("checkbox"),
    options: z.array(checkboxOptionSchema).min(2).max(10),
  })
  .superRefine((question, ctx) => {
    const correctCount = question.options.filter((opt) => opt.isCorrect).length;
    if (correctCount < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one checkbox option must be correct",
        path: ["options"],
      });
    }

    const normalized = question.options.map((opt) => opt.text.trim().toLowerCase());
    const duplicates = normalized.filter((text, idx) => normalized.indexOf(text) !== idx);
    if (duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Checkbox option text must be unique",
        path: ["options"],
      });
    }
  });

export const createQuizSchema = z.object({
  title: trimmedString(3, 120),
  questions: z.array(z.discriminatedUnion("type", [booleanQuestionSchema, inputQuestionSchema, checkboxQuestionSchema])).min(1).max(100),
});

export const quizIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
