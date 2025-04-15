import React, { useState } from "react";
import Swal from "sweetalert2";
import { AlleesRequets, CreateAlleePayload } from "../_request"; // Importer les types et les requêtes pour les allées
import { motion } from "framer-motion";
interface AddAlleesProps {
  onAlleeAdded: () => void; // Fonction pour mettre à jour la liste des allées après l'ajout
  zoneId: number; // ID de la zone à laquelle l'allée sera associée
}

const AddAllees: React.FC<AddAlleesProps> = ({ onAlleeAdded, zoneId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture/fermeture de la modal
  const [alléeNom, setAlleeNom] = useState(""); // Nom de l'allée

  // Fonction pour ouvrir la modal
  const openModal = () => setIsModalOpen(true);

  // Fonction pour fermer la modal
  const closeModal = () => {
    setIsModalOpen(false);
    setAlleeNom(""); // Réinitialiser le champ du nom
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier que le nom de l'allée n'est pas vide
    if (!alléeNom.trim()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le nom de l'allée ne peut pas être vide.",
      });
      return;
    }

    // Créer le payload pour l'ajout de l'allée
    const payload: CreateAlleePayload = {
      alléeNom,
      alléeZoneId: zoneId,
    };

    try {
      // Appeler l'API pour ajouter l'allée
      await AlleesRequets.createAllee(payload);
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "L'allée a été ajoutée avec succès.",
      });
      onAlleeAdded(); // Mettre à jour la liste des allées
      closeModal(); // Fermer la modal
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de l'ajout de l'allée.",
      });
    }
  };

  return (
    <>
      {/* Barre de recherche et bouton d'ajout */}
      <div className="flex justify-between items-center mb-4 animate-fadeIn border-blue-500 border-2 bg-gray-100 rounded-2xl p-4 animate-border">
        <input
          type="text"
          placeholder="Rechercher une allée"
          className="w-full max-w-xs py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={openModal}
        >
          Ajouter une allée
        </button>
      </div>

      {/* Modal pour l'ajout d'une allée */}
      {isModalOpen && (
        <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ajouter une allée</h2>
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

export default AddAllees;