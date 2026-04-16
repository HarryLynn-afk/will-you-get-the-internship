"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  question: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
};

export default function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetch("/api/questions?all=1");

        if (!response.ok) {
          throw new Error("Could not load questions.");
        }

        const data = await response.json();
        setQuestions(data);
      } catch (loadError) {
        setError(loadError.message || "Could not load questions.");
      } finally {
        setLoading(false);
      }
    }

    void loadQuestions();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setError("");
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    const endpoint = editingId ? `/api/questions/${editingId}` : "/api/questions";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save question.");
      }

      if (editingId) {
        setQuestions((current) =>
          current.map((question) => {
            return question.id === data.id ? data : question;
          }),
        );
      } else {
        setQuestions((current) => [data, ...current]);
      }

      resetForm();
    } catch (saveError) {
      setError(saveError.message || "Could not save question.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(question) {
    setEditingId(question.id);
    setForm({
      question: question.question,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this question?")) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete question.");
      }

      setQuestions((current) => current.filter((question) => question.id !== id));
      if (editingId === id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete question.");
    }
  }

  return (
    <main className="shell">
      <section className="pageHeader">
        <div>
          <p className="eyebrowLabel">Question control room</p>
          <h1 className="pageTitle">Admin</h1>
          <p className="mutedText">
            Create, edit, and delete interview questions without leaving the app.
          </p>
        </div>
      </section>

      <section className="adminGrid">
        <form className="panel adminForm" onSubmit={handleSubmit}>
          <div className="panelHeader">
            <div>
              <p className="eyebrowLabel">{editingId ? "Edit mode" : "New question"}</p>
              <h2 className="panelTitle">
                {editingId ? "Update question" : "Add a question"}
              </h2>
            </div>
          </div>

          <div className="field">
            <label className="fieldLabel" htmlFor="question">
              Question
            </label>
            <textarea
              className="textArea"
              id="question"
              name="question"
              rows="4"
              value={form.question}
              onChange={updateField}
            />
          </div>

          <div className="formGrid">
            <div className="field">
              <label className="fieldLabel" htmlFor="option_a">
                Option A
              </label>
              <input
                className="textInput fullWidth"
                id="option_a"
                name="option_a"
                type="text"
                value={form.option_a}
                onChange={updateField}
              />
            </div>
            <div className="field">
              <label className="fieldLabel" htmlFor="option_b">
                Option B
              </label>
              <input
                className="textInput fullWidth"
                id="option_b"
                name="option_b"
                type="text"
                value={form.option_b}
                onChange={updateField}
              />
            </div>
            <div className="field">
              <label className="fieldLabel" htmlFor="option_c">
                Option C
              </label>
              <input
                className="textInput fullWidth"
                id="option_c"
                name="option_c"
                type="text"
                value={form.option_c}
                onChange={updateField}
              />
            </div>
            <div className="field">
              <label className="fieldLabel" htmlFor="option_d">
                Option D
              </label>
              <input
                className="textInput fullWidth"
                id="option_d"
                name="option_d"
                type="text"
                value={form.option_d}
                onChange={updateField}
              />
            </div>
          </div>

          <div className="field">
            <label className="fieldLabel" htmlFor="correct_answer">
              Correct answer
            </label>
            <select
              className="textInput fullWidth"
              id="correct_answer"
              name="correct_answer"
              value={form.correct_answer}
              onChange={updateField}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div className="actionRow">
            <button className="primaryButton" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Question" : "Add Question"}
            </button>
            {editingId ? (
              <button className="secondaryButton" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>

          {error ? <p className="formMessage isError">{error}</p> : null}
        </form>

        <section className="panel questionBank">
          <div className="panelHeader">
            <div>
              <p className="eyebrowLabel">Stored questions</p>
              <h2 className="panelTitle">{loading ? "Loading..." : `${questions.length} total`}</h2>
            </div>
          </div>

          {loading ? (
            <p className="mutedText">Loading question bank...</p>
          ) : questions.length === 0 ? (
            <div className="emptyState">
              <p className="mutedText">No questions yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="questionBankList">
              {questions.map((question) => (
                <article key={question.id} className="questionBankItem">
                  <div className="questionBankTop">
                    <span className="progressPill">Correct: {question.correct_answer}</span>
                    <div className="inlineActions">
                      <button
                        className="miniButton"
                        type="button"
                        onClick={() => handleEdit(question)}
                      >
                        Edit
                      </button>
                      <button
                        className="miniButton danger"
                        type="button"
                        onClick={() => handleDelete(question.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <h3>{question.question}</h3>
                  <ul className="optionSummary">
                    <li>A. {question.option_a}</li>
                    <li>B. {question.option_b}</li>
                    <li>C. {question.option_c}</li>
                    <li>D. {question.option_d}</li>
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
