import axios from "axios";

const Api_Url = "https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api"
const Allees_Url = `${Api_Url}/Allee`

export interface Allee {
    alléeId: number;
    alléeNom: string;
    alléeZoneId: number;
    societe: string;
    site: string;
    zone: string;
}

export interface CreateAlleePayload {
    alléeNom: string;
    alléeZoneId: number
}
export interface UpdateAlleePayload {
    alléeId: number;
    alléeNom: string;
    alléeZoneId: number;
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

//Fonction pour les api's des allées
export const AlleesRequets = {

    //Récupérer les allées par l'id de zone
    getAlleesByZoneId: async (zoneId: number): Promise<Allee[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Allees_Url}/${zoneId}`)
        return response.data;
    },

     //Récupérer les allées par l'id de client
     getAlleesByClientId: async (clientId: number): Promise<Allee[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Allees_Url}?id=${clientId}`)
        return response.data;
     },

     //Création une allée
     createAllee: async (payload: CreateAlleePayload): Promise<Allee> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.post(`${Allees_Url}/create`, payload)
        return response.data;
     },

     //Modification une allée
     updateAllee: async(payload: UpdateAlleePayload): Promise<Allee> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.put(Allees_Url, payload);
        return response.data;
     },

     //Supprimer une allée
      deleteAllee: async (alleeId: number): Promise<void> => {
          const axiosInstance = createAxiosInstance()
          await axiosInstance.delete(`${Allees_Url}/${alleeId}`);
      }

}


