// Imports required keys and values
import { apiKey, baseURL } from "../utils";
import auth from "./auths.ts"

// Defines API respons
interface ApiResponse<T> {
    data?: T;
    message?: string;
    errors?: {
        detail:string;
    };
    users: User[]
}

interface User {
    user_id: string;
    name: string;
    email: string;
    role?: string;
    balance?: number | undefined;
    api_key?: string;
}

interface UserListResponse {
    users: User[];
}

// interface Travels {
//     ride_id : string;
//     user_id: string;
//     scooter_id: string;
//     start_location_id: string;
//     end_location_id: string;
//     start_time: string;
//     end_time: string;
//     average_speed?: string;
//     direction?: string;
//     cost: string;
// }

// interface UserTravelsResponse {
//     Ride: Travels[];
// }

// User module
const Users = {

    // Get all users.
    async getUsers(): Promise<User[]> {
        const response = await fetch(`${baseURL}/v1/user/users?api_key=${apiKey}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
        });

        const result: ApiResponse<UserListResponse> = await response.json();
        if (!response.ok) {
            throw new Error(result.errors?.detail || "Failed to fetch users");
        }

        return result.users;
    },

    // As a admin remove a user account
    async deleteUser(userId: string): Promise<string> {
        const data = {
            api_key: apiKey
        }
        const response = await fetch(`${baseURL}/v1/user/${userId}`, {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`,
            },
        });

        const result: ApiResponse<{}> = await response.json();
        if (!response.ok) {
            throw new Error(result.errors?.detail || "Failed to delete user");
        }

        return result.message || "User deleted successfully";
    },

     // As a admin remove a user account
     async updateUser(userId: string, name:string, email:string): Promise<string> {
        const data = {
            name: name, 
            email: email,
            user_id: userId,
            api_key: apiKey
        }
        const response = await fetch(`${baseURL}/v1/user/update/user`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`,
            },
        });

        const result: ApiResponse<{}> = await response.json();
        if (!response.ok) {
            throw new Error(result.errors?.detail || "Failed to delete user");
        }

        return result.message || "User Updated successfully";
    },
    // As a admin remove a user account
    async getTravels(userId: string): Promise<any> {
       
        const response = await fetch(`${baseURL}/v1/travels/user/${userId}?api_key=${apiKey}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`,
            },
        });

        const result= await response.json();
        if (result.Status === "Success")
        {return result.Ride;}
        else {
            return "empty"
        }
    },


};

export default Users;