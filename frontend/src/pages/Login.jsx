import { BookOpen } from "lucide-react";
import LoginForm from "../components/LoginForm";

function Login({ onLogin }) {
  return (
    <div className="login-page">
      <section className="login-art">
        <BookOpen size={42} color="#C5A878" />
        <h1>Your library, all in one place</h1>
        <p>Sign in to browse books and manage your library.</p>
      </section>
      <section className="login-panel">
        <div className="login-box">
          <h2>Welcome back</h2>
          <p className="muted">Sign in to continue</p>
          <LoginForm onLogin={onLogin} />
        </div>
      </section>
    </div>
  );
}

export default Login;
