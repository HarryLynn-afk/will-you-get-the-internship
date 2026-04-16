function determineVerdict(score) {
  if (score === 5) {
    return "HIRED";
  }

  if (score >= 3) {
    return "GHOSTED";
  }

  return "REJECTED";
}

function buildFallbackRoast({ playerName, jobRole, score }) {
  const safeName = playerName || "Candidate";
  const verdict = determineVerdict(score);

  if (verdict === "HIRED") {
    return `${safeName}, your ${jobRole} interview somehow looked suspiciously competent. HR is nervous, engineering is impressed, and your keyboard has officially earned paid time off.`;
  }

  if (verdict === "GHOSTED") {
    return `${safeName}, your ${jobRole} application had promise, but the recruiter still left your email on read. Not a disaster, just the digital equivalent of "we loved your vibe, not your answers."`;
  }

  return `${safeName}, your ${jobRole} interview felt like a live demo of "it worked on my machine." The recruiter did not reject you with anger, only with the quiet sadness reserved for broken deploys.`;
}

function summarizeAnswers(answersSummary) {
  if (Array.isArray(answersSummary)) {
    return answersSummary
      .map((item, index) => {
        return `${index + 1}. ${item.question} | picked ${item.selected_answer} | correct ${item.correct_answer}`;
      })
      .join("\n");
  }

  return String(answersSummary || "");
}

function buildPrompt({ playerName, jobRole, score, answersSummary }) {
  return `A candidate named ${playerName} just interviewed for a ${jobRole} position.
They scored ${score} out of 5 on a tech interview quiz.
Their answers summary:
${summarizeAnswers(answersSummary)}

Give them a verdict and write a short funny roast (2-3 sentences max) based on their performance and the specific role they wanted.

Respond only as JSON in this exact shape:
{"verdict":"HIRED","roast":"your roast here"}

Verdict must be exactly one of: HIRED, GHOSTED, REJECTED
- HIRED: score 5/5
- GHOSTED: score 3-4/5
- REJECTED: score 0-2/5`;
}

async function requestGroqCompletion(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a brutally honest but funny tech recruiter. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq request failed with status ${response.status}.`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function generateVerdictAndRoast({
  playerName,
  jobRole,
  score,
  answersSummary,
}) {
  const fallback = {
    verdict: determineVerdict(score),
    roast: buildFallbackRoast({ playerName, jobRole, score }),
  };

  if (!process.env.GROQ_API_KEY) {
    return fallback;
  }

  try {
    const content = await requestGroqCompletion(
      buildPrompt({ playerName, jobRole, score, answersSummary }),
    );
    const parsed = JSON.parse(content);

    if (!["HIRED", "GHOSTED", "REJECTED"].includes(parsed.verdict)) {
      return fallback;
    }

    return {
      verdict: parsed.verdict,
      roast: parsed.roast || fallback.roast,
    };
  } catch (error) {
    console.error("Falling back to local verdict generation.", error);
    return fallback;
  }
}
