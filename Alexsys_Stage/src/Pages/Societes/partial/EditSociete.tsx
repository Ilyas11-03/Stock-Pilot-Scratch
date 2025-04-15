import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SocieteRequests, Societe, UpdateSocietePayload, Ville } from "../_request";
import { motion } from "framer-motion";

// Props pour le composant EditSociete
interface EditSocieteProps {
  societe: UpdateSocietePayload;
  onSocieteUpdated: (updatedSociete: UpdateSocietePayload) => void; // Callback pour mettre à jour l'état parent
  onClose: () => void; 
}

const clientId = Number(localStorage.getItem("clientId"));

const EditSociete: React.FC<EditSocieteProps> = ({ societe, onSocieteUpdated, onClose }) => {
  // État pour les données de la société à modifier
  const [updatedSociete, setUpdatedSociete] = useState<UpdateSocietePayload>({
    ...societe,
    societeClientId: clientId,
  });

// const [villes, setVilles] = useState<Ville[]>([])

// //Charger les listes des villes à partir de l'API
// useEffect(() => {
//   const fetchVilles = async () => {
//     try {
//       const response = await SocieteRequests.getAllCity()
//       setVilles(response)
//     } catch (error) {
//       console.error("Erreur lors du chargement des villes :", error);
//       Swal.fire({
//         icon: "error",
//         title: "Erreur",
//         text: "Impossible de charger les villes.",
//       });
//     }
//   }
//   fetchVilles();
// })

  // État pour gérer la soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gestion des changements dans les champs de saisie
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedSociete((prev) => ({
      ...prev,
      [name]: name === "societeVilleId" ? Number(value) : value, // Convertir `societeVilleId` en nombre
    }));
  };
  

  // Soumettre le formulaire de modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs avant la soumission
    if (!updatedSociete.societeRs.trim()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "La raison sociale ne peut pas être vide.",
      });
      return;
    }

    if (!updatedSociete.societeIf.trim()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "L'identifiant fiscal ne peut pas être vide.",
      });
      return;
    }

    if (!updatedSociete.societeEmail.trim() || !/\S+@\S+\.\S+/.test(updatedSociete.societeEmail)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez entrer une adresse e-mail valide.",
      });
      return;
    }

    if (!updatedSociete.societeTelephone.trim()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le numéro de téléphone ne peut pas être vide.",
      });
      return;
    }

    setIsSubmitting(true); // Désactiver le bouton pendant la soumission

    try {
      // Appeler l'API pour mettre à jour la société
      const response = await SocieteRequests.updateSociete(updatedSociete);
      onSocieteUpdated(response); // Mettre à jour l'état parent avec la société modifiée
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "La société a été modifiée avec succès !",
      });
      onClose(); // Fermer le modal après la soumission réussie
    } catch (error) {
      console.error("Error updating société:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la modification de la société.",
      });
    } finally {
      setIsSubmitting(false); // Réactiver le bouton après la soumission
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out"
    >
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Modifier la société</h2>
        <form onSubmit={handleSubmit}>
          {/* Champ Raison Sociale */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">RS de la société (Raison sociale)</label>
            <input
              type="text"
              name="societeRs"
              value={updatedSociete.societeRs}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Champ Identifiant Fiscal */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">IF de la société (Identifiant fiscal)</label>
            <input
              type="text"
              name="societeIf"
              value={updatedSociete.societeIf}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Champ Adresse */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              name="societeAdress"
              value={updatedSociete.societeAdress}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Champ E-Mail */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">E-Mail</label>
            <input
              type="email"
              name="societeEmail"
              value={updatedSociete.societeEmail}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Champ Téléphone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="text"
              name="societeTelephone"
              value={updatedSociete.societeTelephone}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/*Champ Ville */}
          <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">Ville</label>
    <input
      type="text"
      name="societeVilleId"
      value={updatedSociete.societeVilleId}
      onChange={handleChange}
      className="mt-1 block w-full py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      required
      disabled={isSubmitting}
    />
</div>

           {/* Champ ClientId */}
           <div className="mb-4">
            {/* <label className="block text-sm font-medium text-gray-700">ClientId</label> */}
            <input
              type="hidden"
              name="societeClientId"
              value={updatedSociete.societeClientId}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            {/* <label className="block text-sm font-medium text-gray-700">VilleId</label> */}
            <input
              type="hidden"
              name="societeVilleId"
              value={updatedSociete.societeVilleId}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
              disabled={isSubmitting}
            />
          </div>
          

          {/* Boutons d'action */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditSociete;