import { NavLink } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Users,
  ArrowLeftRight,
  LogOut,
} from "lucide-react";

function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <BookOpen size={34} color="#C5A878" />
        <div>
          <h2>LibraryMS</h2>
          <p>Read • Learn • Grow</p>
        </div>
      </div>

      <nav>
        <NavLink to="/" end>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/books">
          <Library size={18} /> Books
        </NavLink>
        <NavLink to="/users">
          <Users size={18} /> Members
        </NavLink>
        <NavLink to="/transactions">
          <ArrowLeftRight size={18} /> Issue / Return
        </NavLink>
      </nav>

      <div className="profile">
        <div className="avatar">{user.name.charAt(0)}</div>
        <div>
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>
        <button className="logout" onClick={onLogout} title="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;