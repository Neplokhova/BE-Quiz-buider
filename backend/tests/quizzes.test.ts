import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Quiz API", () => {
  beforeEach(async () => {
    await prisma.checkboxOption.deleteMany();
    await prisma.booleanAnswer.deleteMany();
    await prisma.inputAnswer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates, fetches, lists and soft deletes a quiz", async () => {
    const createPayload = {
      title: "Backend Contract Quiz",
      questions: [
        { type: "boolean", prompt: "Earth is round?", answer: true },
        { type: "input", prompt: "2 + 2", answer: "4" },
        {
          type: "checkbox",
          prompt: "Select vowels",
          options: [
            { text: "A", isCorrect: true },
            { text: "B", isCorrect: false },
            { text: "E", isCorrect: true },
          ],
        },
      ],
    };

    const created = await request(app).post("/quizzes").send(createPayload).expect(201);
    expect(created.body.title).toBe(createPayload.title);
    expect(created.body.questions).toHaveLength(3);

    const quizId = created.body.id as string;
    await request(app).get(`/quizzes/${quizId}`).expect(200);

    const listed = await request(app).get("/quizzes").expect(200);
    expect(listed.body).toHaveLength(1);
    expect(listed.body[0].questionsCount).toBe(3);

    await request(app).delete(`/quizzes/${quizId}`).expect(204);
    await request(app).get(`/quizzes/${quizId}`).expect(404);
  });

  it("returns validation error for invalid checkbox question", async () => {
    const response = await request(app)
      .post("/quizzes")
      .send({
        title: "Bad quiz",
        questions: [
          {
            type: "checkbox",
            prompt: "Pick",
            options: [
              { text: "Same", isCorrect: false },
              { text: "same", isCorrect: false },
            ],
          },
        ],
      })
      .expect(422);

    expect(response.body.code).toBe("VALIDATION_ERROR");
  });
});
