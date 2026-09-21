import { Link, useLocation, useParams } from "react-router-dom";

import mockQuestions from "../data/mockQuestions";
import { diagnoseAssessment } from "../utils/diagnoseAssessment";

function SkillGapAnalysis() {
  const { skillId } = useParams();
  const location = useLocation();
  const result = location.state;

  if (!result) {
    return (
      <main className="dashboard">
        <h1>No assessment data found</h1>

        <p>
          Complete an assessment first so SkillSense can identify your skill
          gaps.
        </p>

        <Link to={`/skills/${skillId}`} className="back-link">
          ← Back to Skill
        </Link>
      </main>
    );
  }

  const questions = mockQuestions[String(skillId)] ?? [];

  const diagnosis = diagnoseAssessment(
    questions,
    result.answers,
  );

  return (
    <main className="dashboard gap-analysis-page">
      <Link
        to={`/skills/${skillId}/assessment`}
        className="back-link"
      >
        ← Back to Assessment
      </Link>

      <section className="gap-header">
        <p className="eyebrow">SKILL GAP ANALYSIS</p>

        <h1>Understand your skill gaps</h1>

        <p>
          SkillSense analyzed your assessment answers to identify the areas
          where you are strong and the concepts that need more practice.
        </p>
      </section>

      <section className="gap-summary-grid">
        <div className="gap-summary-card">
          <span className="stat-label">Strong Areas</span>
          <strong>{diagnosis.strongAreas.length}</strong>
          <span className="stat-description">
            Concepts you understand well
          </span>
        </div>

        <div className="gap-summary-card">
          <span className="stat-label">Needs Practice</span>
          <strong>{diagnosis.practiceAreas.length}</strong>
          <span className="stat-description">
            Concepts that need reinforcement
          </span>
        </div>

        <div className="gap-summary-card">
          <span className="stat-label">Weak Areas</span>
          <strong>{diagnosis.weakAreas.length}</strong>
          <span className="stat-description">
            Concepts requiring focused learning
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

        <div className="gap-list">
          {diagnosis.subTopics.map((item) => (
            <article
              className={`gap-card gap-${item.status
                .toLowerCase()
                .replace(" ", "-")}`}
              key={`${item.topic}-${item.subTopic}`}
            >
              <div className="gap-card-header">
                <div>
                  <span className="gap-topic">{item.topic}</span>
                  <h3>{item.subTopic}</h3>
                </div>

                <span className="gap-status">
                  {item.status}
                </span>
              </div>

              <div className="gap-progress-header">
                <span>
                  {item.correct} of {item.total} correct
                </span>

                <strong>{item.accuracy}%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{ width: `${item.accuracy}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="recommendation-section">
        <p className="eyebrow">RECOMMENDED NEXT STEP</p>

        <h2>Focus your learning</h2>

        {diagnosis.weakAreas.length > 0 ? (
          <>
            <p>
              Start with the following concepts before taking the assessment
              again.
            </p>

            <div className="recommendation-list">
              {diagnosis.weakAreas.map((item) => (
                <div
                  className="recommendation-card"
                  key={`${item.topic}-${item.subTopic}`}
                >
                  <div className="recommendation-icon">!</div>

                  <div>
                    <h3>{item.subTopic}</h3>

                    <p>
                      Review the fundamentals of {item.subTopic} and
                      practice a few questions before reassessing this area.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>
            No major weak areas were identified in this assessment. Continue
            practicing to maintain your current understanding.
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