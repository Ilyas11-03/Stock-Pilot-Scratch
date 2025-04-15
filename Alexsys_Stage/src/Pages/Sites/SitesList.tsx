import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom'; // Pour récupérer l'ID de la société depuis l'URL
import Swal from 'sweetalert2';
import { SiteRequets, Site, UpdateSitePayload } from './_request'; 
import AddSites from './partial/AddSites';
import EditSite from './partial/EditSites';
import { FaChevronLeft, FaChevronRight, FaEdit, FaEllipsisV, FaTrash } from 'react-icons/fa';
import Header from '../../layout/Header';

const SitesList: React.FC = () => {
  
  const { societeId } = useParams<{ societeId: string }>();
  //On peut récupérer le nom de société depuis les paramètres de l'URL en utilisant useLocation
  const location = useLocation();// Utilisez useLocation pour accéder aux query params
  const queryName = new URLSearchParams(location.search);
  const societeRs = queryName.get('societeRs'); // Récupérez le nom de la société (RS) depuis l'URL

  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const itemsPerPage = 10; // Nombre de sites par page
  const [sites, setSites] = useState<Site[]>([]);
  const [searchItem, setSearchItem] = useState("");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null); // Site sélectionné pour la modification

  // Fonction pour récupérer les sites de l'API
  const fetchSites = async () => {
    try {
      const data = await SiteRequets.getSiteBySocieteId(Number(societeId));
      setSites(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la récupération des sites.',
      });
    }
  };

  // Charger les données au premier rendu
  useEffect(() => {
    fetchSites();
  }, [societeId]);

  // Fonction pour mettre à jour la liste des sites après l'ajout
  const handleSiteAdded = () => {
    fetchSites(); // Recharger la liste des sites
  };

  // Fonction pour gérer la mise à jour d'un site
  const handleSiteUpdated = (updatedSite: UpdateSitePayload) => {
    setSites((prevSites) => 
      prevSites.map((site) => 
        site.siteId === updatedSite.siteId ? { ...site, ...updatedSite } : site
      )
    );
  };

  //Fonction pour gérer la suppression d'un site
  const handleSiteDeleted = async (siteId: number) => {
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
        await SiteRequets.deleteSite(siteId)
        setSites((prevSites) => prevSites.filter((site => site.siteId !== siteId)));
        Swal.fire('Supprimé!', 'Le site a été supprimé.', 'success');
      } catch (error) {
        Swal.fire('Erreur!', "Le site n'a pas été supprimé.", 'error');
      }
    }
  }

  // Fonction pour filtrer en fonction du terme de recherche
  const filteredSites = sites.filter((site) => 
    site.siteNom.toLowerCase().includes(searchItem.toLowerCase()) ||
    site.siteAdress.toLowerCase().includes(searchItem.toLowerCase()) ||
    site.siteVille.toLowerCase().includes(searchItem.toLowerCase()) ||
    site.siteTelephone.toLowerCase().includes(searchItem.toLowerCase()) ||
    site.siteEmail.toLowerCase().includes(searchItem.toLowerCase())
  );

  // Calculer les sites à afficher pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSites = filteredSites.slice(indexOfFirstItem, indexOfLastItem);

  // Fonction pour changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Générer les numéros de page
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredSites.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
    <Header/>
    <section className="container px-4 mx-auto mt-6">
    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
    Liste des Sites de la société :  {societeRs}
  </h1>
  
      {/* Barre de recherche */}
      <div className="flex justify-between mb-4 animate-fadeIn border-blue-500 border-2 bg-gray-100 rounded-2xl p-4 animate-border">
        <input
          type="text"
          placeholder="Rechercher un site..."
          className="w-full max-w-xs h-10 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={searchItem}
          onChange={(e) => {
            setSearchItem(e.target.value);
            setCurrentPage(1); // Réinitialiser la pagination
          }}
        />

          {/* Ajouter le composant AddSites */}
      <AddSites onSiteAdded={handleSiteAdded} societeId={Number(societeId)} />
      </div>

      {/* Tableau des sites */}
      <div className="font-[sans-serif] overflow-x-auto">
        <table className="min-w-full bg-white border divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-800 whitespace-nowrap">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-white">Nom du site</th>
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
                                   <button onClick={() => handleSiteDeleted(site.siteId)} className="">
                                     <FaTrash size={20} color="red"   />
                                   </button>
                </td>
              </tr>
            ))}
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
          className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <span>Suivant</span>
          <FaChevronRight className="w-5 h-5 rtl:-scale-x-100" />
        </button>
      </div>

      {/* Modification de site */}
      {selectedSite && (
        <EditSite
          site={selectedSite}
          onSiteUpdated={handleSiteUpdated}
          onClose={() => setSelectedSite(null)}
        />
      )}
    </section>
    </>
  );
};

export default SitesList;
