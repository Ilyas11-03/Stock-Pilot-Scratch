import axios from "axios";

const Api_Url = "https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api"
const Site_Url = `${Api_Url}/Site`
const Ville_API = `${Api_Url}/Ville`;


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
export interface Ville {
  villeId: number;
  villeNom: string;
  villeRegionId: number;
}

export interface CreateSitePayload {
  siteNom: string;
  siteAdress: string;
  siteVilleId: number;
  siteSocieteId: number;
  siteTelephone: string;
  siteEmail: string;
}

export interface UpdateSitePayload {
  siteId: number;
  siteNom: string;
  siteAdress: string;
  siteVilleId?: number;
  siteSocieteId?: number;
  siteTelephone: string;
  siteEmail: string;
  
}

//Récupérer les sites par societeId (pour le composant SitesList)
export const SiteRequets = {

  //Fetch the sites by societeId
  getSiteBySocieteId: async (societeId: number): Promise<Site[]> => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`${Site_Url}/${societeId}`);
    return response.data;
  },

  //Récupérer les sites par clientId (Pour le composant SitesTable)
  getSiteByClientId: async (clientId: number): Promise<Site[]> => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`${Site_Url}/client/${clientId}`);
    return response.data;
  },
  //Récupérer tous les sites par filtre 
  getSiteByClientIdFilter: async(clientId: number, societeRs: string, currentPage: number, itemsPerPage: number): Promise<Site[]> => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`${Site_Url}?id=${clientId}&societeRs=${societeRs}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`);
    return response.data;
  },

   getAllCity: async() : Promise<Ville[]> => {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`${Ville_API}/GetAll`);
      return response.data;
    },
  
  // Create a new site
 createSite: async (payload: CreateSitePayload): Promise<Site[]> => {
  const axiosInstance = createAxiosInstance();
  const response = await axiosInstance.post(`${Site_Url}/create`, payload);
  return response.data;
},

//Update a site
updateSite: async (payload: UpdateSitePayload): Promise<Site[]> => {
  const axiosInstance = createAxiosInstance();
  const response = await axiosInstance.put(`${Site_Url}`, payload);
  return response.data;
},

//Delete a Site
deleteSite: async (siteId: number): Promise<Site[]> => {
  const axiosInstance = createAxiosInstance();
  const response = await axiosInstance.delete(`${Site_Url}/${siteId}`);
  return response.data;
}

}