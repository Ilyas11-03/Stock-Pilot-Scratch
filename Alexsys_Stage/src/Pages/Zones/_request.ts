import axios from "axios";
// import { Site } from "../Sites/_request";
// import { Societe } from "../Societes/_request";
//Base Api_Url
const Api_Url = "https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api"
const Zone_Url = `${Api_Url}/Zone`;

export interface Zone {
    zoneId: number;
    zoneNom: string;
    zoneSiteId: number;
    // zoneClientId?: number;
    site: string;
    societe: string;
}
export interface CreateZone {
    zoneNom: string;
    zoneSiteId: number
}
export interface UpdateZone {
    zoneId: number;
    zoneNom: string;
    zoneSiteId: number
}

// Crée une instance Axios avec des configurations communes
const createAxiosInstance = () => {

    const token = localStorage.getItem('token'); // Récupère le token depuis le localStorage
    return axios.create({
      baseURL: Api_Url,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

//Fonction pour les api de zone
export const ZoneRequests = {

    //Récupérer tous les zones de clientId
    getZonesbyClientId: async (clientId: number, societeNom: string, siteNom: string, currentPage: number, itemsPerPage: number): Promise<Zone[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Zone_Url}?clientId=${clientId}&societeNom=${societeNom}&siteNom=${siteNom}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`);
        return response.data
    },
    //Récupérer tous les zones de siteId
    getZonesBySiteId: async (siteId: number): Promise<Zone[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Zone_Url}/${siteId}`);
        return response.data;
    },

    //Ajouter une zone
    createZone: async (payload: CreateZone): Promise<Zone> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.post(`${Zone_Url}/create`, payload);
        return response.data;
    },

    //Modifier une zone 
    updateZone: async (payload: UpdateZone): Promise<Zone> => {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.put(Zone_Url, payload);
        return response.data;
    },

    //Supprimer uen zone
    deleteZone: async (zoneId: number): Promise<Zone> => {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.delete(`${Zone_Url}/${zoneId}`);
        return response.data;
    }

}
