import { Link, useLocation } from "react-router-dom";

function AssessmentResults() {
  const location = useLocation();
  const result = location.state;

  if (!result) {
    return (
      <main className="dashboard">
        <h1>No assessment result found</h1>

        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </main>
    );
  }

  const score = Math.round(
    (result.correctAnswers / result.totalQuestions) * 100,
  );

  return (
    <main className="dashboard results-page">
      <section className="results-header">
        <p className="eyebrow">ASSESSMENT COMPLETE</p>

        <h1>Your Assessment Results</h1>

        <p>
          Here's a summary of your performance.
        </p>
      </section>

      <section className="score-card">
        <div className="score-circle">
          <strong>{score}%</strong>
          <span>Score</span>
        </div>

        <div className="score-summary">
          <h2>
            {result.correctAnswers} of {result.totalQuestions} correct
          </h2>

          <p>
            Your assessment is complete. The next step is to understand
            exactly which concepts need more attention.
          </p>
        </div>
      </section>

      <section className="results-next-step">
        <p className="eyebrow">WHAT'S NEXT?</p>

        <h2>Understand your skill gaps</h2>

        <p>
          SkillSense will analyze your performance by topic and sub-topic
          and identify where you should focus your learning.
        </p>

        <div className="results-actions">
          <Link
            to="/"
            className="secondary-button"
          >
            Back to Dashboard
          </Link>

          <Link
            to={`/skills/${result.skillId}/gaps`}
            state={result}
            className="skill-button"
          >
            View Skill Gaps →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AssessmentResults;