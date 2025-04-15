export interface AuthModel {
    id: string;
    token: string;
    expiresAt: string;
    isAuthenticated: boolean;
    userId: string;
    client: {
      id: number;
      nom: string;
      adress: string;
      email: string;
      telephone: string;
      isActive: boolean;
      dateCreation: string | null;
      dateInactif: string | null;
    };
  }
  