import { Link } from "react-router-dom";


function SkillCard({ skill }) {
  return (
    <article className="skill-card">
      <div className="skill-card-top">
        <div className="skill-icon">
          {skill.name.charAt(0).toUpperCase()}
        </div>

        <span className="skill-level">
          Not assessed
        </span>
      </div>


      <h3>{skill.name}</h3>


      <p>
        {skill.description || "No description available."}
      </p>


      <div className="skill-progress">
        <div className="progress-header">
          <span>Assessment</span>

          <span>Not started</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-bar"
            style={{ width: "0%" }}
          />
        </div>
      </div>


      <Link
        to={`/skills/${skill.id}`}
        className="skill-button"
      >
        Start Learning →
      </Link>
    </article>
  );
}


export default SkillCard;