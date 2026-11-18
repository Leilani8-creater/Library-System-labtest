import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";

function TopBar({ user }) {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate("/books?q=" + encodeURIComponent(text));
  }

  return (
    <header className="topbar">
      <form className="search" onSubmit={handleSearch}>
        <Search size={16} />
        <input
          placeholder="Search books by title, author or ISBN..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>

      <div className="topbar-right">
        <Bell size={20} />
        <div className="avatar small">{user.name.charAt(0)}</div>
        <span>{user.name}</span>
      </div>
    </header>
  );
}

export default TopBar;