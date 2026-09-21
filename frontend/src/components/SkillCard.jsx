function SkillCard({ skill }) {
  return (
    <article className="skill-card">
      <div className="skill-card-top">
        <div className="skill-icon">
          {skill.name.charAt(0)}
        </div>

        <span className="skill-level">
          {skill.level}
        </span>
      </div>

      <h3>{skill.name}</h3>

      <p>{skill.description}</p>

      <div className="skill-progress">
        <div className="progress-header">
          <span>Progress</span>
          <span>{skill.progress}%</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-bar"
            style={{ width: `${skill.progress}%` }}
          />
        </div>
      </div>

      <button className="skill-button">
        View Skill →
      </button>
    </article>
  );
}

export default SkillCard;