import React, { useState } from 'react';
import { ZoneRequests, UpdateZone } from '../_request'; // Importer les requêtes pour les zones
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

interface EditZoneProps {
  zone: UpdateZone;
  onZoneUpdated: (updatedZone: UpdateZone) => void;
  onClose: () => void;
}

const EditZone: React.FC<EditZoneProps> = ({ zone, onZoneUpdated, onClose }) => {

  const [zoneNom, setZoneNom] = useState(zone.zoneNom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation : vérifier que le nom de la zone n'est pas vide
    if (!zoneNom.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le nom de la zone ne peut pas être vide.',
      });
      return;
    }

    // Créer l'objet de mise à jour avec les données du formulaire
    const updatedZone: UpdateZone = {
      zoneId: zone.zoneId,
      zoneNom: zoneNom,
      zoneSiteId: zone.zoneSiteId, // Conserver l'ID du site si nécessaire
    };

    try {
      // Appeler la fonction updateZone pour mettre à jour la zone dans l'API
      const response = await ZoneRequests.updateZone(updatedZone);
      // Afficher une notification de succès
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'La zone a été mise à jour avec succès.',
      });
      // Appeler la fonction onZoneUpdated pour mettre à jour l'état dans le composant parent
      onZoneUpdated(response);
      // Fermer le modal après la mise à jour
      onClose();
    } catch (error) {
      // Gérer les erreurs
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour de la zone.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Modifier la zone</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nom de la zone</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={zoneNom}
              onChange={(e) => setZoneNom(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditZone;