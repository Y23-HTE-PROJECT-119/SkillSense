import { Link, useLocation, useParams } from "react-router-dom";
import "./AssessmentResults.css";

function AssessmentResults() {
  const location = useLocation();
  const { assessmentId } = useParams();

  const result = location.state;

  if (!result) {
    return (
      <main className="dashboard">
        <h1>No assessment result found</h1>

        <p>
          The assessment result is not available. Please take the
          assessment again.
        </p>

        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </main>
    );
  }

  const percentage = Math.round(
    result.percentage ??
      (result.max_score > 0
        ? (result.total_score / result.max_score) * 100
        : 0),
  );

  const correctAnswers = result.details
    ? result.details.filter((detail) => detail.is_correct).length
    : result.total_score;

  const totalQuestions = result.details
    ? result.details.length
    : result.max_score;

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
          <strong>{percentage}%</strong>
          <span>Score</span>
        </div>

        <div className="score-summary">
          <h2>
            {correctAnswers} of {totalQuestions} correct
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

          {/* <Link
            to={`/assessments/${assessmentId}/gaps`}
            className="skill-button"
          >
            View Skill Gaps →
          </Link> */}

        <Link
        to={`/assessments/${assessmentId}/gaps`}
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