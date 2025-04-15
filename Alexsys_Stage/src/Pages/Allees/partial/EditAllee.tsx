import React, { useState } from "react";
import Swal from "sweetalert2";
import { AlleesRequets, UpdateAlleePayload } from "../_request"; // Importer les types et les requêtes pour les allées
import { motion } from "framer-motion";

interface EditAlleeModalProps {
  allee: UpdateAlleePayload; // Données de l'allée à modifier
  onClose: () => void; // Fonction pour fermer la modal
  onAlleeUpdated: (updateAllee: UpdateAlleePayload) => void; // Fonction pour mettre à jour la liste des allées après la modification
}

const EditAlleeModal: React.FC<EditAlleeModalProps> = ({ allee, onClose, onAlleeUpdated }) => {

  const [alléeNom, setAlleeNom] = useState(allee.alléeNom); // État pour le nom de l'allée
  const [isSubmitting, setIsSubmitting] = useState(false); // État pour gérer la soumission du formulaire

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation : vérifier que le nom de l'allée n'est pas vide
    if (!alléeNom.trim()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le nom de l'allée ne peut pas être vide.",
      });
      return;
    }

    // Créer le payload pour la mise à jour de l'allée
    const payload: UpdateAlleePayload = {
      alléeId: allee.alléeId, // ID de l'allée à modifier
      alléeNom,
      alléeZoneId: allee.alléeZoneId, // ID de la zone associée
    };

    setIsSubmitting(true); // Désactiver le bouton pendant la soumission

    try {
      // Appeler l'API pour mettre à jour l'allée
      await AlleesRequets.updateAllee(payload);

      // Afficher un message de succès
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "L'allée a été modifiée avec succès.",
      });

      // Mettre à jour la liste des allées et fermer la modal
      onAlleeUpdated(payload);
      onClose();
    } catch (error) {
      // Afficher un message d'erreur en cas d'échec
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la modification de l'allée.",
      });
    } finally {
      setIsSubmitting(false); // Réactiver le bouton après la soumission
    }
  };

  return (
    <motion.div 
    initial={{ opacity: 0, y: -10}}
    animate={{ opacity: 1, y: 0}}
    transition={{ duration: 0.2}}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Modifier l'allée</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nom de l'allée
            </label>
            <input
              type="text"
              placeholder="Nom de l'allée"
              className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={alléeNom}
              onChange={(e) => setAlleeNom(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={isSubmitting} // Désactiver le bouton pendant la soumission
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={isSubmitting} // Désactiver le bouton pendant la soumission
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditAlleeModal;