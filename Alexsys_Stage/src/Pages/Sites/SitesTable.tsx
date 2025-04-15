import React, { useEffect, useState } from 'react';
import { Site, SiteRequets, UpdateSitePayload } from './_request';
import Swal from 'sweetalert2';
import { FaChevronLeft, FaChevronRight, FaEdit, FaEllipsisV, FaTrash } from 'react-icons/fa';
import EditSite from './partial/EditSites';
import Header from '../../layout/Header';
import { Link } from 'react-router-dom';
import { SocieteRequests, Societe } from '../Societes/_request';

const SitesTable: React.FC = () => {
  
  const [sites, setSites] = useState<Site[]>([]);
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [itemsPerPage, setItemsPerPage] = useState(10); // Nombre de sites par page
  const [searchItem, setSearchItem] = useState(""); // Terme de recherche
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);
  const [totalItems, setTotalItems] = useState(0); // Ajout pour gérer le total
  const [societeRs, setSocieteRs] = useState(""); // Nouveau champ pour societeRs
  const clientId = Number(localStorage.getItem("clientId"));

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const sitesData = await SiteRequets.getSiteByClientIdFilter(clientId, societeRs, currentPage, itemsPerPage);
        setSites(sitesData);
        const total = await SiteRequets.getSiteByClientId(clientId)
        setTotalItems(total.length)
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération des sites.',
        });
      }
    };

    const fetchSocietes = async () => {
      try {
        const societesData = await SocieteRequests.getSocietesByClientId(clientId )
        setSocietes(societesData);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération des sociétés.',
        });
      }
    }

    fetchSites();
    fetchSocietes();
  }, [clientId, societeRs, currentPage, itemsPerPage]);

  // Filtrage des sites
  const filteredSites = sites.filter((site) => {

    const matchesSearch = site.siteNom.toLowerCase().includes(searchItem.toLowerCase()) ||
    site.siteAdress.toLowerCase().includes(searchItem.toLowerCase()) ||
    site.siteVille.toLowerCase().includes(searchItem.toLowerCase()) ||
    site.siteEmail.toLowerCase().includes(searchItem.toLowerCase()) ||
    site.siteTelephone.toLowerCase().includes(searchItem.toLowerCase())

    const matchesSociete = selectedSociete ? site.siteSocieteId === selectedSociete.societeId : true;

    return matchesSearch && matchesSociete;
    
});

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSites = filteredSites.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredSites.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Fonction pour modifier un site
  const handleSiteUpdate = (updatedSite: UpdateSitePayload) => {
    setSites((prevSites) =>
      prevSites.map((site) => (site.siteId === updatedSite.siteId ? { ...site, ...updatedSite } : site))
    );
  };

  //Fonction pour supprimer un site
  const handleDeleteSite = async (siteId: number) => {
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
        await SiteRequets.deleteSite(siteId);
        setSites((prevSites) => prevSites.filter((site) => site.siteId !== siteId));
        Swal.fire('Supprimé!', 'Le site a été supprimé.', 'success');
      } catch (error) {
        Swal.fire('Erreur!', "Le site n'a pas été supprimé.", 'error');
      }
    }
  };

  return (
    <>
      <Header />
      <section className="container px-4 mx-auto mt-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
    Liste de Sites
  </h1>
  
        {/* Barre de recherche */}
        <div className="flex justify-between mb-4 animate-fadeIn border-blue-500 border-2 bg-gray-100 rounded-2xl p-4 animate-border">
          <input
            type="text"
            placeholder="Rechercher un site..."
            className="w-full max-w-xs h-17 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchItem}
            onChange={(e) => {
              setSearchItem(e.target.value);
              setCurrentPage(1); // Réinitialiser la pagination à la première page lors de la recherche
            }}
          />

            <select
            className="w-full max-w-xs cursor-pointer h-10 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={selectedSociete ? selectedSociete.societeId : ""}
            onChange={(e) => {
              const selected = societes.find(societe => societe.societeId === Number(e.target.value)) || null;
              setSelectedSociete(selected);
              setCurrentPage(1); // Réinitialiser la pagination à la première page lors du changement de société
            }}
          >

            <option value="">Tous les sociétés</option>
            {societes.map((societe) => (
              <option key={societe.societeId} value={societe.societeId}>
                {societe.societeRs}
              </option>
            ))}
          </select>
        </div>

        {/* Tableau */}
        <div className="font-[sans-serif] overflow-x-auto">
          <table className="min-w-full bg-white border divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 whitespace-nowrap">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-white">Nom</th>
                <th className="p-4 text-left text-sm font-medium text-white">Société</th>
                <th className="p-4 text-left text-sm font-medium text-white">Adresse</th>
                <th className="p-4 text-left text-sm font-medium text-white">Ville</th>
                <th className="p-4 text-left text-sm font-medium text-white">Téléphone</th>
                <th className="p-4 text-left text-sm font-medium text-white">Email</th>
                <th className="p-4 text-left text-sm font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              {currentSites.map((site) => (
                <tr className="even:bg-blue-50" key={site.siteId}>
                  <td className="p-4 text-sm text-black">
                    <Link to={`/zones/${site.siteId}?siteNom=${encodeURIComponent(site.siteNom)}`} className="text-blue-500 hover:text-blue-700">
                                       {site.siteNom}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-black">{site.siteSocieteRs}</td>
                  <td className="p-4 text-sm text-black">{site.siteAdress}</td>
                  <td className="p-4 text-sm text-black">{site.siteVille}</td>
                  <td className="p-4 text-sm text-black">{site.siteTelephone}</td>
                  <td className="p-4 text-sm text-black">{site.siteEmail}</td>
                  <td className="p-4">
                                        <button onClick={() => setSelectedSite(site)} className="">
                                          <FaEdit size={20} color="green"   />
                                        </button>
                                        <button onClick={() => handleDeleteSite(site.siteId)} className="mr-2">
                                          <FaTrash size={20} color="red"   />
                                        </button>
                  </td>
                </tr>
              ))}
              {selectedSite && (
                <EditSite
                  site={selectedSite}
                  onSiteUpdated={handleSiteUpdate}
                  onClose={() => setSelectedSite(null)}
                />
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
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer"
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
            className="flex items-center px-5 py-2 cursor-pointer text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >

            <span>Suivant</span>
            <FaChevronRight className="w-5 h-5 rtl:-scale-x-100" />
          </button>
        </div>
      </section>

      {/* Modal de modification */}
      {selectedSite && (
        <EditSite
          site={selectedSite}
          onSiteUpdated={handleSiteUpdate}
          onClose={() => setSelectedSite(null)}
        />
      )}
    </>
  );
};

export default SitesTable;
