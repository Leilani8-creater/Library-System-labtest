import { useState, useEffect } from "react";
import { API } from "../api";
import UserForm from "../components/UserForm";

function Users({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState({ text: "", isError: false });

  function loadUsers() {
    fetch(`${API}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }

  useEffect(() => {
    if (currentUser.role === "admin") {
      loadUsers();
    }
  }, [currentUser]);

  function handleSave(userData) {
    const isEditing = editingUser !== null;
    const url = isEditing ? `${API}/users/${editingUser.id}` : `${API}/users`;
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage({ text: data.error, isError: true });
        } else {
          setMessage({ text: isEditing ? "Member updated" : "Member added", isError: false });
          setEditingUser(null);
          loadUsers();
        }
      });
  }

  function handleDelete(user) {
    if (user.id === currentUser.id) {
      setMessage({ text: "You cannot delete your own account", isError: true });
      return;
    }
    if (!window.confirm(`Delete ${user.name}?`)) return;

    fetch(`${API}/users/${user.id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage({ text: data.error, isError: true });
        } else {
          setMessage({ text: "Member deleted", isError: false });
          loadUsers();
        }
      });
  }

  if (currentUser.role !== "admin") {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1>Members</h1>
            <p>Manage library members</p>
          </div>
        </div>
        <p className="message">Only admins can manage members.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Members</h1>
          <p>Manage library members</p>
        </div>
      </div>

      {message.text !== "" && (
        <p className={message.isError ? "message error" : "message"}>{message.text}</p>
      )}

      <div className="card section">
        <h3 style={{ marginBottom: 14 }}>{editingUser ? "Update member" : "Add a new member"}</h3>
        <UserForm
          initialUser={editingUser}
          onSubmit={handleSave}
          onCancel={() => setEditingUser(null)}
        />
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.membership_id}</td>
                <td>{user.name}</td>
                <td>
                  <span className={user.role === "admin" ? "badge badge-low" : "badge badge-ok"}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn btn-gold btn-small" onClick={() => setEditingUser(user)}>
                      Update
                    </button>
                    <button className="btn btn-outline btn-small" onClick={() => handleDelete(user)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;