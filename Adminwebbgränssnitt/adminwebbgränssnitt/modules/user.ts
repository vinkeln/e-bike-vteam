// Imports required keys and values
import { apiKey, baseURL } from "../utils";

// Defines API respons
interface ApiResponse<T> {
    data?: T;
    message?: string;
    errors?: {
        detail:string;
    };
}

interface User {
    user_id: string;
    name: string;
    mail: string;
    role: string;
    balance: number;
}

interface UserListResponse {
    users: User[];
}

interface UserData {
    mail: string;
    name: string;
    password: string;
    role: string;
    api_key: string;
}

interface UserAuth {
    token: string;
}

// User module
const userApi = {
    token: "",

    // Get all users.
    async fetchUsers(): Promise<User[]> {
        const response = await fetch(`${baseURL}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`,
            },
        });

        const result: ApiResponse<UserListResponse> = await response.json();
        if (!response.ok) {
            throw new Error(result.errors?.detail || "Failed to fetch users");
        }

        return result.data?.users || [];
    },

    // As a admin remove a user account
    async deleteUser(userId: string): Promise<string> {
        const response = await fetch(`${baseURL}/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`,
            },
        });

        const result: ApiResponse<{}> = await response.json();
        if (!response.ok) {
            throw new Error(result.errors?.detail || "Failed to delete user");
        }

        return result.message || "User deleted successfully";
    },
};

export default userApi;