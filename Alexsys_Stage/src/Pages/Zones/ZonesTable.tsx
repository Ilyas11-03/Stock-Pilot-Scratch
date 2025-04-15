import React, { useEffect, useState } from "react";
import { UpdateZone, Zone, ZoneRequests } from "./_request"; 
import Swal from "sweetalert2";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from 'react-icons/fa';
import Header from "../../layout/Header";
import { Link } from "react-router-dom";
import EditZone from "./partial/EditZones";
import { Site, SiteRequets } from "../Sites/_request";

const ZonesTable: React.FC = () => {

  const [zones, setZones] = useState<Zone[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchItem, setSearchItem] = useState(""); // Terme de recherche
  const [societeNom, setSocieteNom] = useState(""); // Nom de la société
  const [siteNom, setSiteNom] = useState(""); // Nom du site
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null); // Zone sélectionnée
  const [selectedSite, setSelectedSite] = useState<Site | null>(null); // Site sélectionné
  const [totalItems, setTotalItems] = useState(0); // Nombre total d'éléments pour la pagination
 
  // Récupérer l'ID du client depuis le localStorage
  const clientId = Number(localStorage.getItem("clientId")); 

  // Fonction pour récupérer les zones de l'API en utilisant "clientId"
  const fetchZones = async () => {
    try {
      if (clientId) {
        const data = await ZoneRequests.getZonesbyClientId(clientId, societeNom, siteNom, currentPage, itemsPerPage);
        setZones(data);       
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération des zones.',
        });
        console.error("No clientId found:", clientId);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la récupération des zones.',
      });
      console.error("Error fetching zones by ClientId:", error);
    }
  };
  
  //Fonction pour récupérer les sites de l'API en utilisant "clientId"
  const fetchSites = async () => {
    try {
      if (clientId) {
        const data = await SiteRequets.getSiteByClientId(clientId)
        setSites(data)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération des sites.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la récupération des sites.',
      })
    }
  }
 

  useEffect(() => {
    fetchZones();
    fetchSites()
  }, [clientId, societeNom, siteNom, currentPage, itemsPerPage]);

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
  const filteredZones = zones.filter((zone) => {

    const matchesSearch = zone.zoneNom?.toLowerCase().includes(searchItem.toLowerCase()) ||
    zone.site?.toLowerCase().includes(searchItem.toLowerCase()) ||
    zone.societe?.toLowerCase().includes(searchItem.toLowerCase())

    const matchesSites = selectedSite ? zone.zoneSiteId === selectedSite.siteId : true

    return matchesSearch && matchesSites
  }
    
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
    Liste des Zones
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

          {/* Filtre par les zones en utilisant les sites */}
          <select
            className="w-full max-w-xs cursor-pointer h-10 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={selectedSite ? selectedSite.siteId : ""}
            onChange={(e) => {
              const selected = sites.find((site) => site.siteId === Number(e.target.value)) || null;
              setSelectedSite(selected);
              setCurrentPage(1); // Réinitialiser la pagination à la première page lors du changement de site
            }}
          >
            <option value="">Tous les sites</option>
            {sites.map((site) => (
              <option key={site.siteId} value={site.siteId}>
                {site.siteNom}
              </option>
            ))}
          </select>
        </div>
          
       

        {/* Tableau */}
        <div className="font-[sans-serif] overflow-x-auto">
          <table className="min-w-full bg-white border divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 whitespace-nowrap">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-white">Nom de la zone</th>
                <th className="p-4 text-left text-sm font-medium text-white">Site</th>
                <th className="p-4 text-left text-sm font-medium text-white">Sociétés</th>
                <th className="p-4 text-left text-sm font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              {currentZones.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-sm text-center text-gray-500">
                    Aucune zone trouvée.
                  </td>
                </tr>
              ) : (
                currentZones.map((zone) => (
                  <tr key={zone.zoneId} className="even:bg-blue-50">
                    <td className="px-4 py-4 text-sm font-medium">
                      <Link className="text-blue-500 hover:text-blue-700" to={`/allees/${zone.zoneId}?zoneNom=${encodeURIComponent(zone.zoneNom)}`}>
                        {zone.zoneNom}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">{zone.site}</td>
                    <td className="px-4 py-4 text-sm font-medium">{zone.societe}</td>
                    <td className="px-4 py-4 text-sm">
                      <button onClick={() => setSelectedZone(zone)} className="">
                                           <FaEdit size={20} color="green"   />
                                         </button>
                                         <button onClick={() => handleDeleteZone
                                          (zone.zoneId)} className="mr-2">
                                           <FaTrash size={20} color="red"   />
                                         </button>
                    </td>
                  </tr>
                ))
              )}
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
          style={{cursor: 'pointer'}}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <FaChevronLeft className="w-5 h-5 rtl:-scale-x-100"  />
           
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
            style={{cursor: 'pointer'}}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <span>Suivant</span>
            <FaChevronRight className="w-5 h-5 rtl:-scale-x-100"  />
          </button>
        </div>
      </section>
    </>
  );
};

export default ZonesTable;
