function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        SkillSense
      </div>

      <div className="navbar-actions">
        <button className="icon-button" aria-label="Notifications">
          🔔
        </button>

        <div className="profile">
          <div className="profile-avatar">
            G
          </div>

          <div className="profile-info">
            <span className="profile-name">Ganesh</span>
            <span className="profile-role">Learner</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;