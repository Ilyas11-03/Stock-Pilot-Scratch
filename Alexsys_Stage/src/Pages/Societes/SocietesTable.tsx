import React, { useEffect, useState } from 'react';
import EditSociete from './partial/EditSociete';
import Swal from 'sweetalert2';
import { SocieteRequests, Societe, UpdateSocietePayload } from './_request';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from 'react-icons/fa';
import Header from '../../layout/Header';
import SearchFormSociete from './partial/SearchFormSociete';

const SocietesTable: React.FC = () => {
  
  const clientId = Number(localStorage.getItem('clientId'));
  console.log("ClientId:", clientId);

  const [societes, setSocietes] = useState<Societe[]>([]);
  const [filteredSocietes, setFilteredSocietes] = useState<Societe[]>([]);
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0); // Ajout pour gérer le nombre total d'éléments

  // Charger les données en fonction de currentPage et itemsPerPage
  useEffect(() => {
    const fetchSocietes = async () => {
      try {
        const data = await SocieteRequests.getSocietesByClientIdFilter(clientId, currentPage, itemsPerPage);
        console.log("Données chargées depuis l'API:", data);
        setSocietes(data);
        setFilteredSocietes(data);

        // Supposons que l'API renvoie aussi le nombre total d'éléments (à adapter selon ta réponse API)
        // Exemple : { items: Societe[], total: number }
        // Si ce n'est pas le cas, il faudra une autre requête ou une autre logique
        // const total = await SocieteRequests.getSocietesByClientId(clientId); // Méthode hypothétique
        // setTotalItems(total);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération des sociétés.',
        });
      }
    };
    fetchSocietes();
  }, [clientId, currentPage, itemsPerPage]); // Dépendance sur currentPage et itemsPerPage

  const AddSocieteToState = (newSociete: Societe) => {
    console.log("Nouvelle société ajoutée:", newSociete);
    setSocietes((prevSocietes) => [newSociete, ...prevSocietes]);
    setFilteredSocietes((prevSocietes) => [newSociete, ...prevSocietes]);
    setCurrentPage(1); // Retour à la page 1 après ajout
    // Note : Si l'API ne met pas à jour totalItems automatiquement, il faudra le faire ici
    setTotalItems((prev) => prev + 1);
  };

  const handleCloseModal = () => setSelectedSociete(null);

  const handleSocieteUpdate = (updatedSociete: UpdateSocietePayload) => {
    setSocietes((prevSocietes) =>
      prevSocietes.map((societe) =>
        societe.societeId === updatedSociete.societeId
          ? { ...societe, ...updatedSociete }
          : societe
      )
    );
    setFilteredSocietes((prevSocietes) =>
      prevSocietes.map((societe) =>
        societe.societeId === updatedSociete.societeId
          ? { ...societe, ...updatedSociete }
          : societe
      )
    );
  };

  const handleDeleteSociete = async (societeId: number) => {
    const confirmed = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!'
    });

    if (confirmed.isConfirmed) {
      try {
        await SocieteRequests.deleteSociete(societeId);
        setSocietes((prevSocietes) => prevSocietes.filter((societe) => societe.societeId !== societeId));
        setFilteredSocietes((prevSocietes) => prevSocietes.filter((societe) => societe.societeId !== societeId));
        setTotalItems((prev) => prev - 1); // Mise à jour du total
        Swal.fire('Supprimé!', 'La société a été supprimée.', 'success');
      } catch (error) {
        Swal.fire('Erreur!', "La société n'a pas été supprimée.", 'error');
      }
    }
  };

  const handleSearchTermChange = (searchTerm: string) => {
    const filtered = societes.filter((societe) =>
      societe.societeRs.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log("Sociétés filtrées après recherche:", filtered);
    setFilteredSocietes(filtered);
  };

  // Pas besoin de slice ici car l'API gère la pagination
  const currentSocietes = filteredSocietes;

  // Générer les numéros de page en fonction du totalItems
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Réinitialiser la page si elle dépasse le nombre total de pages
  useEffect(() => {
    const maxPage = Math.ceil(totalItems / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (totalItems === 0 || currentPage < 1) {
      setCurrentPage(1);
    }
    console.log("currentSocietes après mise à jour:", currentSocietes);
  }, [totalItems, currentPage, itemsPerPage]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header />
      <section className="container px-4 mx-auto mt-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Liste des Sociétés
        </h1>
        <SearchFormSociete
          societes={societes}
          onSocieteAdded={AddSocieteToState}
          onSearchTermChange={handleSearchTermChange}
        />

        <div className="mb-4">
          <label className="mr-2">Page:</label>
          <input
            type="text"
            value={currentPage}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1) setCurrentPage(value);
            }}
            className="border rounded p-1 w-16"
          />
          <label className="ml-4 mr-2">Items par page:</label>
          <input
            type="text"
            value={itemsPerPage}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1) setItemsPerPage(value);
            }}
            className="border rounded p-1 w-16"
          />
        </div>

        <div className="font-[sans-serif] overflow-x-auto">
          <table className="min-w-full bg-white border divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 whitespace-nowrap">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-white">RS(Raison Sociale)</th>
                <th className="p-4 text-left text-sm font-medium text-white">IF(Identifiant Fiscale)</th>
                <th className="p-4 text-left text-sm font-medium text-white">Adresse</th>
                <th className="p-4 text-left text-sm font-medium text-white">Email</th>
                <th className="p-4 text-left text-sm font-medium text-white">Téléphone</th>
                <th className="p-4 text-left text-sm font-medium text-white">Ville</th>
                <th className="p-4 text-left text-sm font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              {currentSocietes.map((societe) => (
                <tr className="even:bg-blue-50" key={societe.societeId}>
                  <td className="p-4 text-sm text-black">
                    <Link
                      to={`/societes/${societe.societeId}/sites?societeRs=${societe.societeRs}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {societe.societeRs}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-black">{societe.societeIf}</td>
                  <td className="p-4 text-sm text-black">{societe.societeAdress}</td>
                  <td className="p-4 text-sm text-black">{societe.societeEmail}</td>
                  <td className="p-4 text-sm text-black">{societe.societeTelephone}</td>
                  <td className="p-4 text-sm text-black">{societe.societeVille}</td>
                  <td className="p-4">
                    <button onClick={() => setSelectedSociete(societe)}>
                      <FaEdit size={20} color="green" />
                    </button>
                    <button onClick={() => handleDeleteSociete(societe.societeId)} className="mr-2">
                      <FaTrash size={20} color="red" />
                    </button>
                  </td>
                </tr>
              ))}
              {selectedSociete && (
                <EditSociete
                  societe={selectedSociete}
                  onSocieteUpdated={handleSocieteUpdate}
                  onClose={handleCloseModal}
                />
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button
            style={{ cursor: "pointer" }}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer"
          >
            <FaChevronLeft className="w-5 h-5" />
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
            style={{ cursor: "pointer" }}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
            className="flex items-center px-5 py-2 cursor-pointer text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <span>Suivant</span>
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </>
  );
};

export default SocietesTable;