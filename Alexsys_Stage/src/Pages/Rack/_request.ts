import axios from "axios";


const API_URL = 'https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api';
const Rack_Url = `${API_URL}/Rack`;
const pagination = `${API_URL}/Rack?id=3&societers=yassine&sitenom=nakhir&zonenom=zone1&alleenom=alle1&racknom=rack1&currentPage=2&itemsPerPage=6`


export interface Rack {
    rackId: number;
    rackNom: string;
    rackAlléeId: number;
    societe: string;
    site: string;
    zone: string;
    allee: string;
}
export interface CreateRackPayload {
    rackNom: string;
    rackAlleeId: number;
}
export interface UpdateRackPayload {
    rackId: number;
    rackNom: string;
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

//Fonction des api pour les racks 
export const RackRequest = {

    //Récupérer tous les racks
    getAllRacksByClientId: async (clientId: number): Promise<Rack[]> => {
      const axiosInstance = createAxiosInstance()
      const response = await axiosInstance.get(`${Rack_Url}?id=${clientId}`)
      return response.data;
    },

    //Récuperer tous les racks par l'id d'allée
    getRacksByAlleeId: async (alleeId: number): Promise<Rack[]> => {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`${Rack_Url}/${alleeId}`);
      return response.data;
    },

    //Créer un rack
    createRack: async (payload: CreateRackPayload): Promise<Rack> => {
      const axiosInstance = createAxiosInstance()
      const response = await axiosInstance.post(`${Rack_Url}/create`, payload)
      return response.data;
    },

    //Modifier un rack
    updateRack: async (payload: UpdateRackPayload): Promise<Rack> => {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.put(`${Rack_Url}`, payload);
      return response.data;
    }
}