import authModules from "../../modules/auths.ts";
import userModules from "../../modules/user.ts";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserButtons from "./UserButtons.tsx";
interface User {
  user_id: string;
  name: string;
  email: string;
  role?: string;
  balance?: number | undefined;
}

const CustomersTable = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authModules.token) {
        navigate("/login");
        return; // Avbryt om ingen token finns
      }
      try {
        const result = await userModules.getUsers();
        setUserList(result);
      } catch (err) {
        setError("An error occurred while fetching users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserDeleted = (userId: string) => {
    setUserList((prevList) =>
      prevList.filter((user) => user.user_id !== userId)
    );
  };

  const handleUserEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleShowDetails = (userId: string) => {
    navigate(`/user-travels/${userId}`); // Navigera till resesidan med användarens ID
  };

  const handleSaveEdit = async (updatedUser: User) => {
    try {
      await userModules.updateUser(
        updatedUser.user_id,
        updatedUser.name,
        updatedUser.email
      );
      setUserList((prevList) =>
        prevList.map((user) =>
          user.user_id === updatedUser.user_id ? updatedUser : user
        )
      );
      setEditingUser(null); // Stäng redigeringsläget
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>List of Users</h1>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.user_id}>
              <th scope="row">{user.user_id}</th>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <UserButtons
                  user={user.user_id}
                  name={user.name}
                  email={user.email}
                  onUserDeleted={handleUserDeleted}
                  onUserEdit={() => handleUserEdit(user)}
                  onUserDetails={() => handleShowDetails(user.user_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <div>
          <h2>Edit User</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit(editingUser);
            }}
          >
            <label className="form-label">
              Name:
              <input
                className="form-control"
                type="text"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />
            </label>

            <label className="form-label">
              Email:
              <input
                className="form-control"
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
            </label>

            <button className="btn btn-primary" type="submit">
              Save
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomersTable;
