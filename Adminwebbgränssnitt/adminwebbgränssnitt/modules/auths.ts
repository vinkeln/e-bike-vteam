// Importera dina verktyg
import { apiKey, baseURL } from "../utils.ts";

// Definiera typer för API-respons
interface ApiResponse<T> {
  data?: T;
  message?: string;
  token: string;
  errors?: {
    detail: string;
  };
}

interface AuthData {
  token: string;
}

interface UserCredentials {
  mail: string;
  password: string;
  role: string;
  name: string;
  api_key: string;
}

interface UserCredentialsLogin {
  mail: string;
  password: string;
  api_key: string;
}


// Auth-modulen
const auth = {
  token: "",

  // Typa login-metoden
  async login(username: string, password: string): Promise<string> {
    const user: UserCredentialsLogin = {
      mail: username,
      password: password,
      api_key: apiKey,
    };

    const response = await fetch(`${baseURL}/v1/user/login`, {
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const result: ApiResponse<AuthData> = await response.json();

    if (result.message === 'Auth failed') {
      return result.message;
    } else if (result.message === 'Auth successful') {
      
      this.token = result.token;
      // console.log(this.token);
      return "ok";
    } else {
      return "Unexpected error occurred.";
    }


  },

  // Typa register-metoden
  async register(username: string, password: string, email: string, role: string): Promise<string> {
    const user: UserCredentials = {
      mail: email,
      password: password,
      name: username,
      role: role,
      api_key: apiKey,
    };

    const response = await fetch(`${baseURL}/v1/user/signup`, {
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const result: ApiResponse<AuthData> = await response.json();
     console.log(result);
    if (result.message === 'Mail exists') {
      return result.message;
    } else if (result.message === 'User has been created') {
      
      return "ok";
    } else {
      return "Unexpected error occurred.";
    }
  },
};

export default auth;
