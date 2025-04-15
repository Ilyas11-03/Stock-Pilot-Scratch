import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ZoneRequests, Zone, UpdateZone } from './_request'; // Importer les requêtes pour les zones
import AddZones from './partial/AddZones'; // Importer le composant AddZones
import EditZone from './partial/EditZones';
import Swal from 'sweetalert2';
import { FaChevronLeft, FaChevronRight, FaEdit, FaEllipsisV, FaTrash } from 'react-icons/fa';
import Header from '../../layout/Header';

const ZonesList: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>(); // Récupérer l'ID du site depuis l'URL
  const [zones, setZones] = useState<Zone[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [searchItem, setSearchItem] = useState(''); // Terme de recherche
  const itemsPerPage = 10; // Nombres de zones par page
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null); // Zone sélectionnée

  const location = useLocation(); // Utiliser useLocation pour accéder aux query params
  const queryName = new URLSearchParams(location.search)
  const siteNom = queryName.get('siteNom'); // Récupérer le nom du site depuis l'URL

  // Fonction pour récupérer les zones de l'API en fonction de l'ID du site
  const fetchZones = async () => {
    try {
      const data = await ZoneRequests.getZonesBySiteId(Number(siteId));
      setZones(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la récupération des zones.',
      });
    }
  };

  // Charger les données au premier rendu
  useEffect(() => {
    fetchZones();
  }, [siteId]);

  // Fonction pour mettre à jour la liste des zones après l'ajout
  const handleZoneAdded = () => {
    fetchZones(); // Recharger la liste des zones
  };

  // Fonction pour modifier une zone
  const handleZoneUpdated = async (updatedZone: UpdateZone) => {
    try {
      // Mettre à jour la zone dans l'API
      setZones((prevZones) =>
        prevZones.map((zone) =>
          zone.zoneId === updatedZone.zoneId ? { ...zone, ...updatedZone } : zone
        )
      );
      // Fermer le modal après la mise à jour 
      setSelectedZone(null);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour de la zone.',
      });
    }
  };

    //Focntion pour supprimer une zone
    const handleDeleteZone = async (zoneId: number) => {
      const confirmed = await Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimez-le!'
      })
  
      if (confirmed.isConfirmed) {
        try {
          await ZoneRequests.deleteZone(zoneId)
          setZones((prevZones) => prevZones.filter((zone => zone.zoneId !== zoneId)));
          Swal.fire('Supprimé!', 'La zone a été supprimée.', 'success');
        } catch (error) {
          Swal.fire('Erreur!', "La zone n'a pas été supprimée.", 'error');
        }
      }
    };

  // Fonction pour filtrer les zones en fonction du terme de recherche
  const filteredZones = searchItem === "" ? zones : zones.filter((zone) =>
    zone.zoneNom.toLowerCase().includes(searchItem.toLowerCase()) ||
    zone.site.toLowerCase().includes(searchItem.toLowerCase())
  );

  // Calculer les zones à afficher pour la pagination 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentZones = filteredZones.slice(indexOfFirstItem, indexOfLastItem);

  // Fonction pour changer de page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Générer les numéros de page
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredZones.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
    
     <Header />
    <section className="container px-4 mx-auto mt-6">
    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
    Liste des zones du site : {siteNom}
  </h1>

      {/* Barre de recherche */}
      <div className="flex justify-between mb-4 animate-fadeIn border-blue-500 border-2 bg-gray-200 rounded-2xl p-4 animate-border">
        <input
          type="text"
          className="w-full max-w-xs h-10 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Rechercher une zone..."
          value={searchItem}
          onChange={(e) => {
            setSearchItem(e.target.value);
            setCurrentPage(1); // Réinitialiser la pagination à la première page lors de la recherche
          }}
        />
        {/* Ajouter le composant AddZones */}
      <AddZones onZoneAdded={handleZoneAdded} siteId={Number(siteId)} />
      </div>

      {/* Tableau des zones */}
      <div className="font-[sans-serif] overflow-x-auto mt-6">
        <table className="min-w-full bg-white divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left">Nom de la zone</th>
              <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left">Sites</th>
              <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
            {currentZones.map((zone) => (
              <tr key={zone.zoneId} className="even:bg-blue-50">
                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                  <Link className="text-blue-500 hover:text-blue-700" to={`/allees/${zone.zoneId}?zoneNom=${encodeURIComponent(zone.zoneNom)}`}>
                    {zone.zoneNom}
                  </Link>
                </td>
                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                  {zone.site}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <button onClick={() => setSelectedZone(zone)} className="">
                                                            <FaEdit size={20} color="green"   />
                                                          </button>
                                                          <button onClick={() => handleDeleteZone
                                                           (zone.zoneId)} className="mr-2">
                                                            <FaTrash size={20} color="red"   />
                                                          </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modification de zone */}
      {selectedZone && (
        <EditZone
          zone={selectedZone}
          onZoneUpdated={handleZoneUpdated}
          onClose={() => setSelectedZone(null)}
        />
      )}

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
    </section>
    </>
  );
};

export default ZonesList;
