import axios from "axios";

const API_URL = 'https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api';
const Etage_Api = `${API_URL}/Etage`;

export interface Etage {
    etageId: number;
    etageNom: string;
    etageRangéeId: number;
    societe: string;
    site: string;
    zone: string;
    allee: string;
    rack: string;
    rangee: string;
}

export interface CreateEtage {
    etageNom: string;
    etageRangéeId: number;
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

//Fonction pour les étages
export const EtageRequests = {

    getEtageByClientId : async (clientId: number, currentPage: number, itemsPerPage: number): Promise<Etage[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Etage_Api}?id=${clientId}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`)
        return response.data;
    },
    getEtageByRangeeId: async (rangeeId: number): Promise<Etage[]> => {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.get(`${Etage_Api}/${rangeeId}`);
        return response.data;
    },

    createEtage: async (payload: CreateEtage): Promise<Etage> => {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.post(`${Etage_Api}/create`, payload);
        return response.data;
    }
}