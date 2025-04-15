import axios from "axios";


const API_URL = 'https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api';
const Societe_API = `${API_URL}/Societe`;
const Site_API = `${API_URL}/Site`;
const Zone_API = `${API_URL}/Zone`;
const Allee_API = `${API_URL}/Allee`;
const Rack_API = `${API_URL}/Rack`;
const Rangee_API = `${API_URL}/Rangee`;
const Etage_API = `${API_URL}/Etage`;


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
export interface Site {
    siteId: number;
    siteNom: string;
    siteAdress: string;
    siteVille: string;
    siteTelephone: string;
    siteEmail: string;
    siteSocieteId: number;
    siteSocieteRs: string;
  }
export interface Zone {
    zoneId: number;
    zoneNom: string;
    zoneSiteId: number;
    // zoneClientId?: number;
    site: string;
    societe: string;
}
export interface Allee {
    alléeId: number;
    alléeNom: string;
    alléeZoneId: number;
    societe: string;
    site: string;
    zone: string;
}
export interface Rack {
    rackId: number;
    rackNom: string;
    rackAlléeId: number;
    societe: string;
    site: string;
    zone: string;
    allee: string;
}
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
export interface Etage {
    etageId: number;
    etageNom: string;
    etageRangéeId: number;
    societe: string;
    sites: string;
    zone: string;
    allee: string;
    rack: string;
    rangee: string;
}

export const DashboardRequests = {

    getAllSocietes: async (): Promise<Societe[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Societe_API}/3`)
        return response.data;
    },
    getAllSites: async (): Promise<Site[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Site_API}/client/3`)
        return response.data;
    },
    getAllZones: async (): Promise<Zone[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Zone_API}/client/3`)
        return response.data;
    },
    getAllAllees: async (): Promise<Allee[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Allee_API}/client/3`)
        return response.data;
    },
    getAllRacks: async (): Promise<Rack[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Rack_API}?id=3`)
        return response.data;
    },
    getAllRanges: async (): Promise<Range[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Rangee_API}?id=3`)
        return response.data;
    },
    getAllEtages: async (): Promise<Etage[]> => {
        const axiosInstance = createAxiosInstance()
        const response = await axiosInstance.get(`${Etage_API}?id=3`)
        return response.data;
    }
}