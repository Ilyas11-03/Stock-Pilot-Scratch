import React, {useState} from "react";
import { RackRequest, CreateRackPayload, Rack } from "../_request";
import Swal from "sweetalert2";

interface AddRackProps {
    onClose: () => void;
    onRackAdded: (newRack: Rack) => void;
    alleeId: number;
}

const AddRack: React.FC<AddRackProps> = ({ onClose, onRackAdded, alleeId }) => {

    const [rackNom, setRackNom] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rackNom.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Le nom du rack ne peut pas être vide.',
            });
            return;
        }

        const payload: CreateRackPayload = {
            rackNom,
            rackAlleeId: alleeId,
        };

        try {
            const newRack = await RackRequest.createRack(payload)
            onRackAdded(newRack)
            Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: 'Le rack a été ajouté avec succès.',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de l\'ajout du rack.',
            });
        }
    };

    return (
        <div>
        <h2 className="text-xl font-semibold mb-4">Ajouter un Rack</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700">Nom du Rack</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={rackNom}
              onChange={(e) => setRackNom(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Ajouter
          </button>
        </form>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Annuler
        </button>
      </div>
    )
} 

export default AddRack;