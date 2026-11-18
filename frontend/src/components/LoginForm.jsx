import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { API } from "../api";

// These must match the demo accounts you created in MySQL
const demoAccounts = [
  { label: "Admin", membership_id: "Mahlohonolo", password: "901020632" },
  { label: "Member", membership_id: "Mpho", password: "Mpho123" },
];

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ membership_id: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function fillDemo(account) {
    setForm({
      membership_id: account.membership_id,
      password: account.password,
    });
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.membership_id.trim() === "" || form.password === "") {
      setError("Please enter your membership ID and password");
      return;
    }

    fetch(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setError("");
          onLogin(data);
        }
      })
      .catch(() => setError("Could not reach the server"));
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <div className="field input-icon">
          <User size={16} />
          <input
            name="membership_id"
            placeholder="Membership ID"
            value={form.membership_id}
            onChange={handleChange}
          />
        </div>

        <div className="field input-icon" style={{ marginTop: 14 }}>
          <Lock size={16} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-full" type="submit">
          Login
        </button>
      </form>

      <div className="demo-box">
        <h4>Demo accounts</h4>
        <p className="muted small">Click an account to fill in the login details.</p>
        {demoAccounts.map((account) => (
          <button
            key={account.membership_id}
            type="button"
            className="demo-row"
            onClick={() => fillDemo(account)}
          >
            <strong>{account.label}</strong>
            <span>
              ID: {account.membership_id} &nbsp; Password: {account.password}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LoginForm;