"use client";

import { useEffect, useState } from "react";
import { JOB_ROLES } from "../data/jobRoles";

const emptyForm = {
  role: "",
  question: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
};

export default function AdminPageClient() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
    setError("");
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
      role: question.role || "",
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete question.");
      }

      setQuestions((current) => current.filter((question) => question.id !== id));
      if (editingId === id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete question.");
    }
  }

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredQuestions = questions.filter((question) => {
    const matchesRole = roleFilter === "All" || question.role === roleFilter;
    const matchesSearch =
      normalizedSearch === "" ||
      [
        question.question,
        question.option_a,
        question.option_b,
        question.option_c,
        question.option_d,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesRole && matchesSearch;
  });

  function roleCount(role) {
    return questions.filter((question) => question.role === role).length;
  }

  const hasActiveFilters = roleFilter !== "All" || normalizedSearch !== "";

  return (
    <main className="shell">
      <section className="pageHeader adminHeader">
        <div>
          <p className="eyebrowLabel">Question control room</p>
          <h1 className="pageTitle">Question Manager</h1>
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
            <label className="fieldLabel" htmlFor="role">
              Job role
            </label>
            <select
              className="textInput fullWidth"
              id="role"
              name="role"
              value={form.role}
              onChange={updateField}
            >
              <option value="">Select a role</option>
              {JOB_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
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
              <h2 className="panelTitle">
                {loading ? "Loading..." : `${filteredQuestions.length} shown`}
              </h2>
              {!loading ? (
                <p className="mutedText questionBankSummary">
                  {hasActiveFilters
                    ? `Filtered from ${questions.length} total questions`
                    : `${questions.length} total questions in the bank`}
                </p>
              ) : null}
            </div>
          </div>

          <div className="questionBankControls">
            <div className="roleFilterBar" aria-label="Filter questions by role">
              <button
                className={`roleFilterChip ${roleFilter === "All" ? "isActive" : ""}`}
                type="button"
                onClick={() => setRoleFilter("All")}
              >
                All
                <span>{questions.length}</span>
              </button>
              {JOB_ROLES.map((role) => (
                <button
                  key={role}
                  className={`roleFilterChip ${roleFilter === role ? "isActive" : ""}`}
                  type="button"
                  onClick={() => setRoleFilter(role)}
                >
                  {role}
                  <span>{roleCount(role)}</span>
                </button>
              ))}
            </div>

            <div className="field questionSearchField">
              <label className="fieldLabel" htmlFor="question-search">
                Search questions
              </label>
              <input
                className="textInput fullWidth"
                id="question-search"
                name="question-search"
                type="search"
                placeholder="Search question text or option copy"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <p className="mutedText">Loading question bank...</p>
          ) : filteredQuestions.length === 0 ? (
            <div className="emptyState">
              <p className="questionEmptyTitle">
                {questions.length === 0 ? "No questions yet" : "No matching questions"}
              </p>
              <p className="mutedText">
                {questions.length === 0
                  ? "Add your first question on the left to start building the bank."
                  : roleFilter !== "All"
                    ? `No ${roleFilter} questions match your current search. Try another role or clear the search field.`
                    : "Nothing matches your current search. Try a broader keyword."}
              </p>
            </div>
          ) : (
            <div className="questionBankList">
              {filteredQuestions.map((question) => (
                <article
                  key={question.id}
                  className={`questionBankItem ${
                    editingId === question.id ? "isEditing" : ""
                  }`}
                >
                  <h3>{question.question}</h3>

                  <div className="questionBankMeta">
                    <div className="questionMetaRow">
                      <span className="questionMetaPill">
                        {question.role || "Unassigned role"}
                      </span>
                      <span className="questionMetaPill">
                        Correct: {question.correct_answer}
                      </span>
                      {editingId === question.id ? (
                        <span className="questionMetaPill isEditing">Editing now</span>
                      ) : null}
                    </div>

                    <div className="questionActions">
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

                  <details className="questionOptions" open={editingId === question.id}>
                    <summary>View answer options</summary>
                    <ul className="optionSummary optionSummary--dense">
                      <li>A. {question.option_a}</li>
                      <li>B. {question.option_b}</li>
                      <li>C. {question.option_c}</li>
                      <li>D. {question.option_d}</li>
                    </ul>
                  </details>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
