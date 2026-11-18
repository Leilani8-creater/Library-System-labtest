import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Top";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Tranactions";
import Users from "./pages/Users";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("libraryUser");
    return saved ? JSON.parse(saved) : null;
  });

  function handleLogin(user) {
    localStorage.setItem("libraryUser", JSON.stringify(user));
    setCurrentUser(user);
  }

  function handleLogout() {
    localStorage.removeItem("libraryUser");
    setCurrentUser(null);
  }

  // Not logged in: show only the login screen
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <Sidebar user={currentUser} onLogout={handleLogout} />
      <div className="main">
        <TopBar user={currentUser} />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard user={currentUser} />} />
            <Route path="/books" element={<Books />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/users" element={<Users currentUser={currentUser} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;