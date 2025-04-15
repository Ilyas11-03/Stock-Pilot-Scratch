import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { RangeRequests, CreateRangePayload, Range as RangeType } from '../_request';

interface AddRangeProps {
  onRangeAdded: (newRange: RangeType) => void;
  onClose: () => void;
}

const AddRange: React.FC<AddRangeProps> = ({ onRangeAdded, onClose }) => {
  const [rangeNom, setRangeNom] = useState('');
  const [rangeRackId, setRangeRackId] = useState<number | null>(null);

  const handleAddRange = async () => {
    if (!rangeNom || rangeRackId === null) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs.',
      });
      return;
    }

    const payload: CreateRangePayload = {
      rangéeNom: rangeNom,
      rangéeRackId: rangeRackId,
    };

    try {
      const newRange = await RangeRequests.createRange(payload);
      onRangeAdded(newRange);
      Swal.fire('Succès!', 'La rangée a été ajoutée.', 'success');
      onClose();
    } catch (error) {
      Swal.fire('Erreur!', "La rangée n'a pas été ajoutée.", 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Ajouter une nouvelle rangée</h2>
        <div className="mb-4">
          <label htmlFor="rangeNom" className="block text-sm font-medium text-gray-700">
            Nom de la rangée
          </label>
          <input
            type="text"
            id="rangeNom"
            value={rangeNom}
            onChange={(e) => setRangeNom(e.target.value)}
            className="mt-1 px-3 py-2 border rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="rangeRackId" className="block text-sm font-medium text-gray-700">
            ID du Rack
          </label>
          <input
            type="number"
            id="rangeRackId"
            value={rangeRackId ?? ''}
            onChange={(e) => setRangeRackId(Number(e.target.value))}
            className="mt-1 px-3 py-2 border rounded-md w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
          >
            Annuler
          </button>
          <button
            onClick={handleAddRange}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRange;