import React, { useState, useEffect } from "react";
import { UpdateSitePayload, SiteRequets } from "../_request";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

interface EditSiteProps {
  site: UpdateSitePayload;
  onSiteUpdated: (updatedSite: UpdateSitePayload) => void;
  onClose: () => void;
}

const EditSite: React.FC<EditSiteProps> = ({ site, onSiteUpdated, onClose }) => {
  const [formData, setFormData] = useState<UpdateSitePayload>({
    siteId: site.siteId,
    siteNom: site.siteNom,
    siteAdress: site.siteAdress,
    siteEmail: site.siteEmail,
    siteTelephone: site.siteTelephone,
    siteSocieteId: site.siteSocieteId,
    siteVilleId: site.siteVilleId
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // État pour gérer la soumission du formulaire

  useEffect(() => {
    setFormData(site); // Mettre à jour le formulaire avec les données du site sélectionné
  }, [site]);

    //Fonction pour récupérer les villes
    // const [villes, setVilles] = useState<Ville[]>([])
    
    //Charger les listes des villes à partir de l'API
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     // Validation : vérifier que le nom du site n'est pas vide
      if (!formData.siteNom.trim()) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Le nom du site ne peut pas être vide.",
        });
        return;
      }

      setIsSubmitting(true); // Désactiver le bouton pendant la soumission

    try {
      // Appeler la fonction updateSite avec les données du formulaire
      const updatedSite = await SiteRequets.updateSite(formData);
        
      Swal.fire({
        title: "Succès !",
        text: "Le site a été modifié avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
      // Appeler la fonction onSiteUpdated pour mettre à jour la liste des sites
      onSiteUpdated(updatedSite[0]);
      // Fermer le modal
      onClose();
    } catch (error) {
      // Afficher une alerte d'erreur
      Swal.fire({
        title: "Erreur !",
        text: "Une erreur s'est produite lors de la modification du site.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false); // Réactiver le bouton après la soumission
    }
  };

  return (
    <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Modifier le site</h2>
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="siteEmail"
              placeholder="Email"
              value={formData.siteEmail}
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
              SiteSocieteId
            </label> */}
            <input
              type="hidden"
              name="siteSocieteId"
              placeholder="Email"
              value={formData.siteSocieteId}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={isSubmitting} // Désactiver le bouton pendant la soumission
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={isSubmitting} // Désactiver le bouton pendant la soumission
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditSite;