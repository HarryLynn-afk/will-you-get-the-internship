import { sampleQuestions } from "../data/sampleQuestions";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createStore() {
  return {
    questions: sampleQuestions.map((question) => ({
      ...question,
      created_at: new Date().toISOString(),
    })),
    results: [],
    nextQuestionId: sampleQuestions.length + 1,
    nextResultId: 1,
  };
}

const store = globalThis.__internshipQuizStore || createStore();
globalThis.__internshipQuizStore = store;

function sortResults(results) {
  return [...results].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });
}

export function listLocalQuestions() {
  return clone(
    [...store.questions].sort((left, right) => {
      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    }),
  );
}

export function listRandomLocalQuestions(limit = 5) {
  return clone(
    [...store.questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit),
  );
}

export function getLocalQuestionById(id) {
  const question = store.questions.find((item) => item.id === Number(id));
  return question ? clone(question) : null;
}

export function createLocalQuestion(payload) {
  const question = {
    id: store.nextQuestionId++,
    ...payload,
    created_at: new Date().toISOString(),
  };

  store.questions.push(question);
  return clone(question);
}

export function updateLocalQuestion(id, payload) {
  const index = store.questions.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return null;
  }

  store.questions[index] = {
    ...store.questions[index],
    ...payload,
  };

  return clone(store.questions[index]);
}

export function deleteLocalQuestion(id) {
  const index = store.questions.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return false;
  }

  store.questions.splice(index, 1);
  return true;
}

export function listLocalResults() {
  return clone(sortResults(store.results));
}

export function getLocalResultById(id) {
  const result = store.results.find((item) => item.id === Number(id));
  return result ? clone(result) : null;
}

export function createLocalResult(payload) {
  const result = {
    id: store.nextResultId++,
    ...payload,
    created_at: new Date().toISOString(),
  };

  store.results.push(result);
  return clone(result);
}

export function deleteLocalResult(id) {
  const index = store.results.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return false;
  }

  store.results.splice(index, 1);
  return true;
}
