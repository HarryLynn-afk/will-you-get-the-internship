import { getDb, isDbConfigured } from "./db";
import {
  createLocalQuestion,
  createLocalResult,
  deleteLocalQuestion,
  deleteLocalResult,
  getLocalQuestionById,
  getLocalResultById,
  listLocalQuestions,
  listLocalResults,
  listRandomLocalQuestions,
  updateLocalQuestion,
} from "./localStore";

function serialize(record) {
  if (!record) {
    return null;
  }

  return {
    ...record,
    created_at: record.created_at
      ? new Date(record.created_at).toISOString()
      : null,
  };
}

async function withDbFallback(runDb, runFallback) {
  if (!isDbConfigured()) {
    return runFallback();
  }

  try {
    const db = getDb();
    return await runDb(db);
  } catch (error) {
    console.error("Falling back to local data store.", error);
    return runFallback();
  }
}

function sanitizeLimit(limit) {
  const parsed = Number(limit);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(parsed, 20)) : 5;
}

export async function listQuestions() {
  return withDbFallback(
    async (db) => {
      const [rows] = await db.query(
        "SELECT * FROM questions ORDER BY created_at DESC, id DESC",
      );

      return rows.map(serialize);
    },
    async () => listLocalQuestions(),
  );
}

export async function getRandomQuestions(limit = 5) {
  const safeLimit = sanitizeLimit(limit);

  return withDbFallback(
    async (db) => {
      const [rows] = await db.query(
        `SELECT * FROM questions ORDER BY RAND() LIMIT ${safeLimit}`,
      );

      return rows.map(serialize);
    },
    async () => listRandomLocalQuestions(safeLimit),
  );
}

export async function getQuestionById(id) {
  return withDbFallback(
    async (db) => {
      const [rows] = await db.execute("SELECT * FROM questions WHERE id = ?", [
        Number(id),
      ]);

      return serialize(rows[0] || null);
    },
    async () => getLocalQuestionById(id),
  );
}

export async function createQuestion(payload) {
  return withDbFallback(
    async (db) => {
      const [result] = await db.execute(
        `INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          payload.question,
          payload.option_a,
          payload.option_b,
          payload.option_c,
          payload.option_d,
          payload.correct_answer,
        ],
      );

      return getQuestionById(result.insertId);
    },
    async () => createLocalQuestion(payload),
  );
}

export async function updateQuestion(id, payload) {
  return withDbFallback(
    async (db) => {
      await db.execute(
        `UPDATE questions
         SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?
         WHERE id = ?`,
        [
          payload.question,
          payload.option_a,
          payload.option_b,
          payload.option_c,
          payload.option_d,
          payload.correct_answer,
          Number(id),
        ],
      );

      return getQuestionById(id);
    },
    async () => updateLocalQuestion(id, payload),
  );
}

export async function deleteQuestion(id) {
  return withDbFallback(
    async (db) => {
      const [result] = await db.execute("DELETE FROM questions WHERE id = ?", [
        Number(id),
      ]);

      return result.affectedRows > 0;
    },
    async () => deleteLocalQuestion(id),
  );
}

export async function listResults() {
  return withDbFallback(
    async (db) => {
      const [rows] = await db.query(
        "SELECT * FROM results ORDER BY score DESC, created_at DESC",
      );

      return rows.map(serialize);
    },
    async () => listLocalResults(),
  );
}

export async function getResultById(id) {
  return withDbFallback(
    async (db) => {
      const [rows] = await db.execute("SELECT * FROM results WHERE id = ?", [
        Number(id),
      ]);

      return serialize(rows[0] || null);
    },
    async () => getLocalResultById(id),
  );
}

export async function createResult(payload) {
  return withDbFallback(
    async (db) => {
      const [result] = await db.execute(
        `INSERT INTO results (player_name, job_role, score, verdict, roast)
         VALUES (?, ?, ?, ?, ?)`,
        [
          payload.player_name,
          payload.job_role,
          payload.score,
          payload.verdict,
          payload.roast,
        ],
      );

      return getResultById(result.insertId);
    },
    async () => createLocalResult(payload),
  );
}

export async function deleteResult(id) {
  return withDbFallback(
    async (db) => {
      const [result] = await db.execute("DELETE FROM results WHERE id = ?", [
        Number(id),
      ]);

      return result.affectedRows > 0;
    },
    async () => deleteLocalResult(id),
  );
}
