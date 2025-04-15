import React, { useState } from 'react';
import { ZoneRequests, CreateZone } from '../_request'; // Importer les requêtes pour les zones
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

interface AddZoneProps {
  onZoneAdded: () => void; // Fonction pour mettre à jour la liste des zones
  siteId: number; // ID du site auquel la zone appartient
}

const AddZones: React.FC<AddZoneProps> = ({ onZoneAdded, siteId }) => {

  const [zoneNom, setZoneNom] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture/fermeture du modal

  // Fonction pour ajouter une nouvelle zone
  const handleAddZone = async () => {
    if (!zoneNom) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Remplis le champ connard!'
      })
      return;
    }

    try {
      const payload: CreateZone = {
        zoneNom,
        zoneSiteId: siteId,
      };
      await ZoneRequests.createZone(payload);
      Swal.fire({icon: 'success', title: 'Succès', text: 'La zone a été ajoutée avec succès !'});
      setZoneNom(''); // Réinitialiser le champ
      onZoneAdded(); // Mettre à jour la liste des zones
      setIsModalOpen(false); // Fermer le modal après l'ajout
    } catch (error) {
      Swal.fire({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue lors de l\'ajout de la zone.'}); // Remplacez par votre propre gestion d'erreurs
    }
  };

  return (
    <>

      {/* Bouton pour ouvrir le modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Ajouter une zone
      </button>

      {/* Modal */}
      {isModalOpen && (
        <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Ajouter une zone</h2>
            <input
              type="text"
              placeholder="Nom de la zone"
              value={zoneNom}
              onChange={(e) => setZoneNom(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleAddZone}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Ajouter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AddZones;