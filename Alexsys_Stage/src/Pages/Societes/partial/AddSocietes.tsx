import React, { useState } from "react";
import Swal from "sweetalert2"
import { SocieteRequests, Societe, CreateSocietePayload} from "../_request";
import { motion } from "framer-motion";


// Props pour le composant AddSociete
interface AddSocieteProps {
  onSocieteAdded: (newSociete: Societe) => void
}

const AddSociete: React.FC<AddSocieteProps> = ({onSocieteAdded}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
      // Récupérer le clientId depuis le localStorage
    const clientId = Number(localStorage.getItem("clientId"));
    console.log("ClientId:", clientId);

    //Etat pour les champs de la société
    const [societe, setSociete] = useState<CreateSocietePayload>({
      societeRs: "",
      societeIf: "",
      societeAdress: "",
      societeTelephone: "",
      sociteEmail: "",
      societeClientId: clientId,
      societeVilleId: 1,
    })

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

  
    // Fonction pour gérer les changements dans les champs de saisie
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Extraction du nom et de la valeur de l'élément cible
      const { name, value } = e.target
      // Mise à jour de l'état de la société avec la nouvelle valeur
      setSociete((prev) => ({ ...prev,
        [name]: name === "societeVilleId" ? Number(value) : value, // Convertir `societeVilleId` en nombre 
        }))
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Société qui sera ajoutée:", societe);
        //La logique pour soumettre le formulaire
        try {
          //Appel au méthode createSociete de SocieteRequests
           const newSociete = await SocieteRequests.createSociete(societe)
           onSocieteAdded(newSociete)
    
           Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'La société a été ajoutée avec succès !',
          });
          
          closeModal(); // Fermer le modal après soumission
          setSociete({
            societeRs: "",
            societeIf: "",
            societeAdress: "",
            societeTelephone: "",
            sociteEmail: "",
            societeClientId: clientId,
            societeVilleId: 1,
          }); // Réinitialiser les champs
          
        } catch (error) {
          console.error("Error adding societe:", error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'ajout de la société',
          })
        }
     
      };
    return (
        <>
<div className="flex justify-between items-center mb-4">
  <button
    className="mr-auto py-4 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
    onClick={openModal}
  >
    Ajouter une société
  </button>
</div>

 {/* Modal */}
 {isModalOpen && (
        <motion.div 
        initial={{ opacity: 0 , y: -20}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out">
          
          <div className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-500 ease-in-out ${isModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
            <h2 className="text-xl font-bold mb-4">Ajouter une société</h2>
            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  RS de la société (Raison sociale)
                </label>
                <input
                  type="text"
                  name="societeRs"
                  value={societe.societeRs}
                  placeholder="Raison sociale"
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  IF de la société (Identifiant fiscale)
                </label>
                <input
                  type="text"
                  name="societeIf"
                  value={societe.societeIf}
                  onChange={handleChange}
                  placeholder="Identifiant fiscale"
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
                  name="societeAdress"
                  value={societe.societeAdress}
                  onChange={handleChange}
                  placeholder="Adresse"
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
                  name="societeTelephone"
                  value={societe.societeTelephone}
                  onChange={handleChange}
                  placeholder="Téléphone"
                  className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                /> </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  E-Mail
                </label>
                <input
                  type="text"
                  name="sociteEmail"
                  value={societe.sociteEmail}
                  onChange={handleChange}
                  placeholder="E-Mail"
                  className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

  
 {/*Champ Ville */}
 <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">Ville</label>
    <input
      type="text"
      name="societeVilleId"
      value={societe.societeVilleId}
      onChange={handleChange}
      className="mt-1 block w-full py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      required
    />
</div>

<div className="mb-4">
                {/* <label className="block text-sm font-medium text-gray-700">
                  ClientId
                </label> */}
                <input
                  type="hidden"
                  name="societeClientId"
                  value={clientId}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                /> </div>

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
    )
}
export default AddSociete