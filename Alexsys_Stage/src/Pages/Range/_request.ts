import axios from "axios";

const API_URL = 'https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api';

const Range_Url = `${API_URL}/Rangee`;

export interface Range {
    rangéeId: number;
    rangéeNom: string;
    rangéeRackId: number;
    societe: string;
    site: string;
    zone: string;
    allee: string;
    rack: string;
    
}

export interface CreateRangePayload {
    rangéeNom: string;
    rangéeRackId: number;
}

// Crée une instance Axios avec des configurations communes
const createAxiosInstance = () => {

    const token = localStorage.getItem('token'); // Récupère le token depuis le localStorage
    return axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

//Fonction pour les api de rangé

export const RangeRequests = {

    //Récupérer tous les rangées par clientId
    getRangesByClientId: async (clientId: number): Promise<Range[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Range_Url}?id=${clientId}`);
        return response.data;
    },

    //Récupérer tous les rangées par rackId
    getRangesByRackId: async (rackId: number): Promise<Range[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Range_Url}/${rackId}`);
        return response.data;
    },

    //Ajouter une rangée
    createRange: async (payload: CreateRangePayload): Promise<Range> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.post(`${Range_Url}/create`, payload);
        return response.data;
    },
  
    //Supprimer une rangée
    deleteRange: async (rangéeId: number): Promise<void> => {
        const axiosInstance = createAxiosInstance()
        await axiosInstance.delete(`${Range_Url}/${rangéeId}`);
    },

   
}