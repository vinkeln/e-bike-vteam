import React, { useEffect, useState } from 'react';
import userApi from '../../modules/user.ts';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>("");

    // Funktion för att hämta alla användare
    const fetchUsers = async () => {
        try {
            const fetchedUsers = await userApi.fetchUsers();
            setUsers(fetchedUsers);
            setError("");
        } catch (err) {
            setError("Failed to get users");
            console.error(err);
        }
    };

    // Funktion för att ta bort en användare som administratör
    const handleDeleteUser = async (userId: string) => {
        try {
            const message = await userApi.deleteUser(userId);
            alert(message); // Visa ett meddelande när en användare har tagits bort
            fetchUsers(); // Uppdaterar listan med alla användare
        } catch (err) {
            setError("Failed to delete the user");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>User Management</h1>
            {error && <p>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.name}</td>
                            <td>{user.mail}</td>
                            <td>{user.role}</td>
                            <td>{user.balance}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
