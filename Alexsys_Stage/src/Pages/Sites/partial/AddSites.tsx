import React, { useState } from "react";
import { CreateSitePayload, SiteRequets } from "../_request"; // Importer les types et la fonction
import Swal from "sweetalert2"; // Pour les alertes
import { motion } from "framer-motion";


interface AddSitesProps { //Ce code définit une interface AddSitesProps qui spécifie la forme des props attendues par un composant React
  onSiteAdded: () => void; // Fonction pour mettre à jour la liste des sites
  societeId: number; // Prop pour récupérer l'ID de la société

} 

const AddSites: React.FC<AddSitesProps> = ({ onSiteAdded, societeId }) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSitePayload>({
    siteNom: "",
    siteAdress: "",
    siteVilleId: 1, // Remplacez par l'ID de la ville si nécessaire
    siteSocieteId: societeId, // Utiliser l'ID de la société passé en prop
    siteTelephone: "",
    siteEmail: "",
  })

  //Fonction pour récupérer les villes
  // const [villes, setVilles] = useState<Ville[]>([])
  
  // //Charger les listes des villes à partir de l'API
  // useEffect(() => {
  //       const fetchVilles = async () => {
  //         try {
  //           const response = await SiteRequets.getAllCity()
  //           setVilles(response)
  //         } catch (error) {
  //           console.error("Erreur lors du chargement des villes :", error);
  //           Swal.fire({
  //             icon: "error",
  //             title: "Erreur",
  //             text: "Impossible de charger les villes.",
  //           });
  //         }
  //       }
  //       fetchVilles();
  //     })

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      siteNom: "",
      siteAdress: "",
      siteTelephone: "",
      siteEmail: "",
      siteVilleId: 1,
      siteSocieteId: societeId,
    }); // Réinitialiser le formulaire
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Appeler la fonction createSite avec les données du formulaire
      await SiteRequets.createSite(formData);
      // Afficher une alerte de succès
      Swal.fire({
        title: "Succès !",
        text: "Le site a été ajouté avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Fermer le modal
      closeModal();
      // Appeler la fonction onSiteAdded pour mettre à jour la liste des sites
      onSiteAdded();
    } catch (error) {
      // Afficher une alerte d'erreur
      Swal.fire({
        title: "Erreur !",
        text: "Une erreur s'est produite lors de l'ajout du site.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Erreur:", error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button
          className=" py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={openModal}
        >
          Ajouter un site
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-x-hidden">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ajouter un site</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nom du site
                </label>
                <input
                  type="text"
                  name="siteNom"
                  placeholder="Nom du site"
                  value={formData.siteNom}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  name="siteAdress"
                  placeholder="Adresse"
                  value={formData.siteAdress}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

             {/*Champ Ville */}
             <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700">Ville</label>
            <input
      type="text"
      name="siteVilleId"
      value={formData.siteVilleId}
      onChange={handleChange}
      className="mt-1 block w-full py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      required
    />
</div>

              
              <div className="mb-4">
                {/* <label className="block text-sm font-medium text-gray-700">
                  SocieteId
                </label> */}
                <input
                  type="hidden"
                  name="siteSocieteId"
                  placeholder="Ville"
                  value={formData.siteSocieteId}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  E-Mail
                </label>
                <input
                  type="email"
                  name="siteEmail"
                  placeholder="E-Mail"
                  value={formData.siteEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="text"
                  name="siteTelephone"
                  placeholder="Téléphone"
                  value={formData.siteTelephone}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AddSites;