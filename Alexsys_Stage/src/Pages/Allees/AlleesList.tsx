import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AlleesRequets, Allee, UpdateAlleePayload } from "./_request"; // Importer les types et les requêtes pour les allées
import AddAllees from "./partial/AddAllees"; // Importer le composant AddAllees
import EditAllee from "./partial/EditAllee"; // Importer le composant EditAllee
import { FaEdit, FaPencilAlt, FaTrash } from "react-icons/fa";
import Header from "../../layout/Header";

const AlleesList: React.FC = () => {
  const { zoneId } = useParams<{ zoneId: string }>(); // Récupérer l'ID de la zone depuis l'URL
  const [allees, setAllees] = useState<Allee[]>([]); // Liste des allées
  const [searchItem, setSearchItem] = useState(""); // Terme de recherche
  const [selectedAllee, setSelectedAllee] = useState<Allee | null>(null); // Allée sélectionnée pour la modification
  const location = useLocation(); // Utiliser useLocation pour accéder aux query params
  const queryName = new URLSearchParams(location.search);
  const zoneNom = queryName.get("zoneNom"); // Récupérer le nom de la zone depuis l'URL

  // Fonction pour récupérer les allées de l'API
  const fetchAllees = async () => {
    try {
      const data = await AlleesRequets.getAlleesByZoneId(Number(zoneId));
      setAllees(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la récupération des allées.",
      });
    }
  };

  // Charger les données au premier rendu
  useEffect(() => {
    fetchAllees();
  }, [zoneId]);

  // Fonction pour mettre à jour la liste des allées après l'ajout
  const handleAlleeAdded = () => {
    fetchAllees(); // Recharger la liste des allées
  };

  // Fonction pour gérer la mise à jour d'une allée
  const handleAlleeUpdated = (updatedAllee: UpdateAlleePayload) => {
    setAllees((prevAllees) =>
      prevAllees.map((allee) =>
        allee.alléeId === updatedAllee.alléeId ? { ...allee, ...updatedAllee } : allee
      )
    );
  };

  //Fonction pour supprimer une allée
  const handleDeleteAllee = async (alleeId: number) => {
    const confirmed = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le!",
    });

    if (confirmed.isConfirmed) {
      try {
        await AlleesRequets.deleteAllee(alleeId);
        setAllees((prevAllees) => prevAllees.filter((allee) => allee.alléeId !== alleeId));
        Swal.fire("Supprimé!", "L'allée a été supprimée.", "success");
      } catch (error) {
        Swal.fire("Erreur!", "L'allée n'a pas été supprimée.", "error");
      }
    }
  }

  // Fonction pour filtrer les allées en fonction du terme de recherche
  const filteredAllees = allees.filter(
    (allee) =>
      allee.alléeNom.toLowerCase().includes(searchItem.toLowerCase()) ||
      allee.zone.toLowerCase().includes(searchItem.toLowerCase()) ||
      allee.site.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <>
    <Header/>
    <section className="container px-4 mx-auto mt-6">
  
  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
    Liste des Allées de zone : {zoneNom}
  </h1>

  {/* Barre de recherche et bouton d'ajout */}
  <AddAllees onAlleeAdded={handleAlleeAdded} zoneId={Number(zoneId)} />

  <div className="flex flex-col mt-6">
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full bg-white divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3.5 px-4 text-sm font-normal text-left">Nom de l'allée</th>
                <th className="px-4 py-3.5 text-sm font-normal text-left">Zone</th>
                <th className="px-4 py-3.5 text-sm font-normal text-left">Site</th>
                <th className="px-4 py-3.5 text-sm font-normal text-left">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAllees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-sm text-center text-gray-500">
                    Aucune allée trouvée.
                  </td>
                </tr>
              ) : (
                filteredAllees.map((allee) => (
                  <tr key={allee.alléeId} className="even:bg-blue-50">
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      <Link className="text-blue-600 hover:text-blue-800" to={`/rack/${allee.alléeId}`}>
                        {allee.alléeNom}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      {allee.zone}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      {allee.site}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <button
                        onClick={() => setSelectedAllee(allee)}
                       
                      >
                        <FaEdit size={20} color="green"  className="mr-1" />
                        
                      </button>
                      <button
                        onClick={() => handleDeleteAllee(allee.alléeId)}
                      
                      >
                        <FaTrash size={20} color="red" className="mr-1" />
                        
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  {/* Modal de modification d'une allée */}
  {selectedAllee && (
    <EditAllee
      allee={selectedAllee}
      onAlleeUpdated={handleAlleeUpdated}
      onClose={() => setSelectedAllee(null)}
    />
  )}
</section>

    </>
  );
};

export default AlleesList;