function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <a href="#" className="sidebar-link active">
          <span>⌂</span>
          Dashboard
        </a>

        <a href="#" className="sidebar-link">
          <span>◈</span>
          My Skills
        </a>

        <a href="#" className="sidebar-link">
          <span>✓</span>
          Assessments
        </a>

        <a href="#" className="sidebar-link">
          <span>◔</span>
          Progress
        </a>
      </nav>

      <div className="sidebar-bottom">
        <a href="#" className="sidebar-link">
          <span>⚙</span>
          Settings
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;