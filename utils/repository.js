import { getDb, isDbConfigured } from "./db";
import {
  countLocalAdminUsers,
  createLocalUser,
  createLocalQuestion,
  createLocalResult,
  deleteLocalQuestion,
  deleteLocalResult,
  getLocalQuestionById,
  getLocalResultById,
  getLocalUserByEmail,
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

function sanitizeRole(role) {
  return String(role || "").trim();
}

async function ensureQuestionsTable(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL,
      option_a VARCHAR(255),
      option_b VARCHAR(255),
      option_c VARCHAR(255),
      option_d VARCHAR(255),
      correct_answer CHAR(1),
      role VARCHAR(100) NOT NULL DEFAULT 'Full Stack Developer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [roleColumn] = await db.query("SHOW COLUMNS FROM questions LIKE 'role'");

  if (!roleColumn.length) {
    await db.query(`
      ALTER TABLE questions
      ADD COLUMN role VARCHAR(100) NOT NULL DEFAULT 'Full Stack Developer'
      AFTER correct_answer
    `);
  }
}

async function ensureUsersTable(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function listQuestions(role = "") {
  const safeRole = sanitizeRole(role);

  return withDbFallback(
    async (db) => {
      await ensureQuestionsTable(db);
      const [rows] = safeRole
        ? await db.execute(
          "SELECT * FROM questions WHERE role = ? ORDER BY created_at DESC, id DESC",
          [safeRole],
        )
        : await db.query("SELECT * FROM questions ORDER BY created_at DESC, id DESC");

      return rows.map(serialize);
    },
    async () => listLocalQuestions(safeRole),
  );
}

export async function getRandomQuestions(limit = 5, role = "") {
  const safeLimit = sanitizeLimit(limit);
  const safeRole = sanitizeRole(role);

  return withDbFallback(
    async (db) => {
      await ensureQuestionsTable(db);
      const [rows] = safeRole
        ? await db.execute(
          `SELECT * FROM questions WHERE role = ? ORDER BY RAND() LIMIT ${safeLimit}`,
          [safeRole],
        )
        : await db.query(
          `SELECT * FROM questions ORDER BY RAND() LIMIT ${safeLimit}`,
        );

      const dbQuestions = rows.map(serialize);

      if (dbQuestions.length >= safeLimit) {
        return dbQuestions;
      }

      const fallbackQuestions = listRandomLocalQuestions(safeLimit * 2, safeRole);
      const seenPrompts = new Set(dbQuestions.map((question) => question.question));
      const supplementalQuestions = fallbackQuestions.filter((question) => {
        return !seenPrompts.has(question.question);
      });

      return [...dbQuestions, ...supplementalQuestions].slice(0, safeLimit);
    },
    async () => listRandomLocalQuestions(safeLimit, safeRole),
  );
}

export async function getQuestionById(id) {
  return withDbFallback(
    async (db) => {
      await ensureQuestionsTable(db);
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
      await ensureQuestionsTable(db);
      const [result] = await db.execute(
        `INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          payload.question,
          payload.option_a,
          payload.option_b,
          payload.option_c,
          payload.option_d,
          payload.correct_answer,
          payload.role,
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
      await ensureQuestionsTable(db);
      await db.execute(
        `UPDATE questions
         SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?, role = ?
         WHERE id = ?`,
        [
          payload.question,
          payload.option_a,
          payload.option_b,
          payload.option_c,
          payload.option_d,
          payload.correct_answer,
          payload.role,
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
      await ensureQuestionsTable(db);
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

export async function countAdminUsers() {
  return withDbFallback(
    async (db) => {
      await ensureUsersTable(db);
      const [rows] = await db.query(
        "SELECT COUNT(*) AS total FROM users WHERE role = 'admin'",
      );

      return Number(rows[0]?.total || 0);
    },
    async () => countLocalAdminUsers(),
  );
}

export async function getUserByEmail(email) {
  const safeEmail = String(email || "").trim().toLowerCase();

  if (!safeEmail) {
    return null;
  }

  return withDbFallback(
    async (db) => {
      await ensureUsersTable(db);
      const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
        safeEmail,
      ]);

      return serialize(rows[0] || null);
    },
    async () => getLocalUserByEmail(safeEmail),
  );
}

export async function createUser(payload) {
  const safeEmail = String(payload.email || "").trim().toLowerCase();

  return withDbFallback(
    async (db) => {
      await ensureUsersTable(db);
      const [result] = await db.execute(
        `INSERT INTO users (email, password_hash, role)
         VALUES (?, ?, ?)`,
        [safeEmail, payload.password_hash, payload.role || "user"],
      );

      const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [
        result.insertId,
      ]);

      return serialize(rows[0] || null);
    },
    async () =>
      createLocalUser({
        email: safeEmail,
        password_hash: payload.password_hash,
        role: payload.role || "user",
      }),
  );
}
