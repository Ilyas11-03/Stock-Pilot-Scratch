import axios from "axios";
import { AuthModel} from "./_models";

// Base API URL from environment variable
const apiUrl = 'https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api/';

// Endpoints
export const LOGIN_URL = `${apiUrl}Auth/login`;

console.log("Login URL:", LOGIN_URL); // Logs the login URL for debugging

/**
 * Sends a login request to the server.
 * @param username - The username of the user.
 * @param password - The user's password.
 * @returns A Promise resolving to AuthModel.
 */
export function login(username: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, { //envoie une requête POST au serveur avec un nom d'utilisateur et un mot de passe
    username,
    password,
  },
  
  //Elle retourne une Promesse qui se résout en un objet AuthModel.
  //La requête est effectuée à l'aide de la bibliothèque axios vers l'URL définie par LOGIN_URL
);

}