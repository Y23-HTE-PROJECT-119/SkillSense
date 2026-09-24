import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getAssessmentDiagnosis } from "../services/api";

function SkillGapAnalysis() {
  const { assessmentId } = useParams();

  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDiagnosis() {
      try {
        setLoading(true);
        setError("");

        const data = await getAssessmentDiagnosis(assessmentId);

        setDiagnosis(data);
      } catch (error) {
        console.error("Failed to load assessment diagnosis:", error);

        setError(
          error.message ||
            "Unable to load the skill gap analysis.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDiagnosis();
  }, [assessmentId]);

  if (loading) {
    return (
      <main className="dashboard">
        <p>Analyzing your assessment...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard">
        <h1>Unable to load skill gap analysis</h1>

        <p>{error}</p>

        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </main>
    );
  }

  if (!diagnosis) {
    return (
      <main className="dashboard">
        <h1>No diagnosis found</h1>

        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </main>
    );
  }

  const diagnoses = diagnosis.diagnoses ?? [];

  const strongSubtopics = diagnoses.filter(
    (item) =>
      item.status?.toLowerCase() === "strong" ||
      item.status?.toLowerCase() === "mastered",
  );

  const weakSubtopics = diagnoses.filter(
    (item) =>
      item.status?.toLowerCase() === "weak" ||
      item.status?.toLowerCase() === "needs practice",
  );

  return (
    <main className="dashboard gap-analysis-page">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <section className="gap-header">
        <p className="eyebrow">SKILL GAP ANALYSIS</p>

        <h1>Understand your skill gaps</h1>

        <p>
          SkillSense analyzed your assessment performance to identify
          the areas where you are strong and the concepts that need
          more practice.
        </p>
      </section>

      <section className="gap-summary-grid">
        <div className="gap-summary-card">
          <span className="stat-label">Overall Score</span>

          <strong>
            {Math.round(diagnosis.overall_percentage ?? 0)}%
          </strong>

          <span className="stat-description">
            Overall assessment performance
          </span>
        </div>

        <div className="gap-summary-card">
          <span className="stat-label">Strong Areas</span>

          <strong>{strongSubtopics.length}</strong>

          <span className="stat-description">
            Sub-topics you understand well
          </span>
        </div>

        <div className="gap-summary-card">
          <span className="stat-label">Needs Practice</span>

          <strong>{weakSubtopics.length}</strong>

          <span className="stat-description">
            Sub-topics that need reinforcement
          </span>
        </div>
      </section>

      <section className="gap-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DETAILED ANALYSIS</p>

            <h2>Sub-topic Performance</h2>
          </div>
        </div>

        {diagnoses.length === 0 ? (
          <p>No sub-topic diagnosis is available yet.</p>
        ) : (
          <div className="gap-list">
            {diagnoses.map((item) => {
              const accuracy = Math.round(
                item.accuracy_percentage ?? 0,
              );

              const statusClass = (item.status || "unknown")
                .toLowerCase()
                .replace(/\s+/g, "-");

              return (
                <article
                  className={`gap-card gap-${statusClass}`}
                  key={item.subtopic_id}
                >
                  <div className="gap-card-header">
                    <div>
                      <span className="gap-topic">
                        {item.topic_name}
                      </span>

                      <h3>{item.subtopic_name}</h3>
                    </div>

                    <span className="gap-status">
                      {item.status || "Unknown"}
                    </span>
                  </div>

                  <div className="gap-progress-header">
                    <span>
                      {item.correct_answers} of{" "}
                      {item.total_questions} correct
                    </span>

                    <strong>{accuracy}%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>

                  {item.severity && (
                    <p>
                      <strong>Severity:</strong>{" "}
                      {item.severity}
                    </p>
                  )}

                  {item.evidence_summary && (
                    <p>{item.evidence_summary}</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="recommendation-section">
        <p className="eyebrow">RECOMMENDED NEXT STEP</p>

        <h2>Focus your learning</h2>

        {weakSubtopics.length > 0 ? (
          <>
            <p>
              These sub-topics were identified as areas that need
              additional practice.
            </p>

            <div className="recommendation-list">
              {weakSubtopics.map((item) => (
                <div
                  className="recommendation-card"
                  key={item.subtopic_id}
                >
                  <div className="recommendation-icon">
                    !
                  </div>

                  <div>
                    <h3>{item.subtopic_name}</h3>

                    <p>
                      Your accuracy in this sub-topic was{" "}
                      {Math.round(
                        item.accuracy_percentage ?? 0,
                      )}
                      %. Review the concept and practice
                      additional questions before taking a
                      targeted re-test.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>
            No major weak areas were identified in this
            assessment. Continue practicing to maintain your
            current understanding.
          </p>
        )}

        <div className="results-actions">
          <Link to="/" className="secondary-button">
            Back to Dashboard
          </Link>

          <button className="skill-button" disabled>
            Start Recommended Learning
          </button>
        </div>
      </section>
    </main>
  );
}

export default SkillGapAnalysis;