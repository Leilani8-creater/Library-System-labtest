import { useState, useEffect } from "react";

const emptyUser = { name: "", membership_id: "", role: "member", password: "" };

function UserForm({ initialUser, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyUser);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialUser) {
      setForm({
        name: initialUser.name,
        membership_id: initialUser.membership_id,
        role: initialUser.role,
        password: "",
      });
    } else {
      setForm(emptyUser);
    }
    setErrors({});
  }, [initialUser]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (form.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (form.membership_id.trim() === "") {
      newErrors.membership_id = "Membership ID is required";
    }
    if (!initialUser && form.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit(form);
    if (!initialUser) {
      setForm(emptyUser);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="field">
          <label>Membership ID</label>
          <input
            name="membership_id"
            value={form.membership_id}
            onChange={handleChange}
          />
          {errors.membership_id && (
            <p className="error-text">{errors.membership_id}</p>
          )}
        </div>

        <div className="field">
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {!initialUser && (
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="btn" type="submit">
          {initialUser ? "Save changes" : "Add user"}
        </button>
        {initialUser && (
          <button className="btn btn-grey" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default UserForm;