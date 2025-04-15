import React, { useEffect, useState } from "react";
import { Allee, AlleesRequets, UpdateAlleePayload } from "./_request";
import Swal from "sweetalert2";
import { FaChevronLeft, FaChevronRight, FaEdit, FaPencilAlt, FaTrash } from "react-icons/fa";
import Header from "../../layout/Header";
import { Link } from "react-router-dom";
import EditAllee from "./partial/EditAllee";

const AlleesTable: React.FC = () => {
  const [allees, setAllees] = useState<Allee[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [selectedAllee, setSelectedAllee] = useState<Allee | null>(null); // Allée sélectionnée pour la modification
  const itemsPerPage = 10;

  // Récupérer l'Id du client depuis localStorage
  const clientId = Number(localStorage.getItem("clientId"));

  // Fonction pour récupérer les Allées de l'API en utilisant clientId
  const fetchAllees = async () => {
    try {
      if (clientId) {
        const data = await AlleesRequets.getAlleesByClientId(clientId);
        console.log("Données récupérées :", data); // Ajoutez ce log
        setAllees(data); // Mettre à jour l'état avec les allées récupérées
      } else {
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'ClientId non trouvé!' });
        console.error("ClientId introuvable", clientId);
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Mochkila a sadid9i' });
      console.error("Erreur ", error);
    }
  };

  // Charger les données au premier rendu
  useEffect(() => { fetchAllees(); }, [clientId]); // Déclencher useEffect lorsque clientId change

  // Fonction pour filtrer des allées en fonction de terme de recherche
  const filteredAllees = searchItem === ""
    ? allees : allees.filter((allee) =>
      allee.alléeNom.toLowerCase().includes(searchItem.toLowerCase()) ||
      allee.alléeNom.toLowerCase().includes(searchItem.toLowerCase())
    );
      
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

  // Calculer les allées à afficher pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAllees = filteredAllees.slice(indexOfFirstItem, indexOfLastItem);

  // Fonction pour changer de page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Générer les numéros de page
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredAllees.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Header />
      <section className="container px-4 mx-auto mt-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
    Liste des Allées
  </h1>
        {/* Barre de recherche */}
        <div className="flex justify-between mb-4 animate-fadeIn border-blue-500 border-2 bg-gray-100 rounded-2xl p-4 animate-border">
          <input
            type="text"
            className="w-full max-w-xs h-10 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Rechercher une allée..."
            value={searchItem}
            onChange={(e) => {
              setSearchItem(e.target.value);
              setCurrentPage(1); // Réinitialiser la pagination à la première page lors de la recherche
            }}
          />
        </div>

        {/* Tableau */}
        <div className="font-[sans-serif] overflow-x-auto mt-6 border">
          <table className="min-w-full bg-white divide-y divide-gray-200 dark:divide-gray-700">
            {/* En-tête du tableau */}
            <thead className="bg-gray-800 text-white">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 px-4 text-sm font-normal text-left"
                >
                  Allées
                </th>
                <th
                  scope="col"
                  className="px-12 py-3.5 text-sm font-normal text-left"
                >
                  Zones
                </th>
                <th
                  scope="col"
                  className="px-8 py-3.5 text-sm font-normal text-left"
                >
                  Sites
                </th>
                <th
                  scope="col"
                  className="px-8 py-3.5 text-sm font-normal text-left"
                >
                  Sociétés
                </th>
                <th scope="col" className="relative py-3.5">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Corps du tableau */}
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
              {currentAllees.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-sm text-center text-gray-500">
                    Aucune allée trouvée.
                  </td>
                </tr>
              ) : (
                currentAllees.map((allee) => (
                  <tr key={allee.alléeId} className="even:bg-blue-50">
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      <Link
                      className="text-blue-500 hover:text-blue-700"
                      to={`/rack/${allee.alléeId}`}>
                      {allee.alléeNom}
                      </Link>
                    </td>
                    <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                      {allee.zone}
                    </td>
                    <td className="px-8 py-4 text-sm font-medium whitespace-nowrap">
                      {allee.site}
                    </td>
                    <td className="px-8 py-4 text-sm font-medium whitespace-nowrap">
                      {allee.societe}
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button
          style={{ cursor: "pointer"}}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <FaChevronLeft className="w-5 h-5 rtl:-scale-x-100" />
            <span>Précédent</span>
          </button>

          <div className="items-center hidden md:flex gap-x-3">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-2 py-1 text-sm rounded-md ${
                  currentPage === number
                    ? "text-blue-500 bg-blue-100/60 dark:bg-gray-800"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {number}
              </button>
            ))}
          </div>

          <button
          style={{ cursor: "pointer"}}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <span>Suivant</span>
            <FaChevronRight className="w-5 h-5 rtl:-scale-x-100" />
          </button>
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

export default AlleesTable;
