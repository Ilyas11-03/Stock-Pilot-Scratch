import axios from 'axios';

// URL de base de l'API
const API_URL = 'https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net'; // Utilisez une variable d'environnement pour l'URL de l'API
const Ville_API = `${API_URL}/api/Ville`;

// Crée une instance Axios avec des configurations communes
const createAxiosInstance = () => {

  const token = localStorage.getItem('token'); // Récupère le token depuis le localStorage
  return axios.create({ //Configurez les en-tetes de http pour chaque requete
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// Interfaces pour les sociétés
export interface Societe {
  societeId: number;
  societeRs: string;
  societeIf: string;
  societeAdress: string;
  societeTelephone: string;
  societeEmail: string; 
  societeVille: string;
  societeVilleId: number;
}
export interface Ville {
  villeId: number;
  villeNom: string;
  villeRegionId: number;
}

export interface CreateSocietePayload {
  societeRs: string;
  societeIf: string;
  societeAdress: string;
  societeTelephone: string;
  sociteEmail: string;
  societeClientId?: number;
  societeVilleId?: number;
}

export interface UpdateSocietePayload {
  societeId: number;
  societeRs: string;
  societeIf: string;
  societeAdress: string;
  societeTelephone: string;
  societeEmail: string;
  societeClientId?: number;
  societeVilleId?: number;
}


// Fonctions pour les sociétés
export const SocieteRequests = { // Les requêtes pour les sociétés

   getSocietesByClientId: async (clientId: number): Promise<Societe[]> => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`${API_URL}/api/Societe/${clientId}`);
    return response.data;
   },

  // Récupérer toutes les sociétés d'un client en utilisant son clientId avec el filtrage
  getSocietesByClientIdFilter: async (clientId: number, currentPage: number, itemsperPage: number): Promise<Societe[]> => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`${API_URL}/api/Societe/?clientId=${clientId}&currentPage=${currentPage}&itemsPerPage=${itemsperPage}`);
    return response.data;
  },
 
  getAllCity: async() : Promise<Ville[]> => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`${Ville_API}/GetAll`);
    return response.data;
  },

  // Créer une société
  createSociete: async (payload: CreateSocietePayload): Promise<Societe> => {
    const axiosInstance = createAxiosInstance();
    console.log('Payload to be sent:', payload);
    const response = await axiosInstance.post(`${API_URL}/api/Societe/create`, payload);
    return response.data;
   
  },
  

  // Mettre à jour une société
  updateSociete: async (payload: UpdateSocietePayload): Promise<Societe> => {
    const axiosInstance = createAxiosInstance();
    console.log('Payload to be sent:', payload);
    const response = await axiosInstance.put(`${API_URL}/api/Societe`, payload);
    return response.data;
  },

  //Supprimer une société
  deleteSociete: async (societeId: number): Promise<void> => {
    const axiosInstance = createAxiosInstance();
    await axiosInstance.delete(`${API_URL}/api/Societe/${societeId}`);
  },
};

// // Fonctions pour l'authentification
// export const AuthRequests = {
//   // Se connecter
//   login: async (username: string, password: string): Promise<{ token: string; clientId: number }> => {
//     const response = await axios.post(`${API_URL}/api/Auth/login`, {
//       username,
//       password,
//     });
//     return response.data;
//   },

//   // Se déconnecter (optionnel)
//   logout: async (): Promise<void> => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('clientId');
//   },
// };

// // Fonctions pour d'autres entités (exemple : Client, Ville, etc.)
// export const ClientRequests = {
//   // Récupérer un client par ID
//   getClientById: async (clientId: number): Promise<any> => {
//     const axiosInstance = createAxiosInstance();
//     const response = await axiosInstance.get(`/api/Client/${clientId}`);
//     return response.data;
//   },
// };