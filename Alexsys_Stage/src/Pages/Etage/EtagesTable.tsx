import React, {useEffect, useState} from "react";
import { Etage, EtageRequests } from "./_requests";
import Swal from "sweetalert2";
import Header from "../../layout/Header";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";


const EtagesTable: React.FC = () => {
    //Etat pour stocker la liste des étages
    const [etages, setEtages] = useState<Etage[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const clientId = Number(localStorage.getItem('clientId'))

    //Fonction pour récupérer les étages de l'API
    const fetchEtages = async () => {
        try {
            const data = await EtageRequests.getEtageByClientId(clientId, currentPage, itemsPerPage)
            setEtages(data)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la récupération des étages.',
            })
        }
    }  

    useEffect(() => {
        fetchEtages()
    }, [clientId, currentPage, itemsPerPage]);

    //Filtrer les étages
    const filteredEtages = etages.filter((etage) => 
     etage.etageNom.toLowerCase().includes(searchTerm.toLowerCase())
    )
    //Fonction pour changer de page
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    //Générer les numéros de page
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(filteredEtages.length / itemsPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
        <>
          <Header />
      <section className="container px-4 mx-auto mt-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Liste des Étages
        </h1>

        {/* Search bar */}
        <div className="flex justify-between mb-4 animate-fadeIn border-blue-500 border-2 bg-gray-100 rounded-2xl p-4 animate-border">
          <input
            type="text"
            placeholder="Rechercher un étage..."
            className="w-full max-w-xs h-10 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="mr-2">Page:</label>
          <input
            type="number"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="border rounded p-1"
          />
          <label className="ml-4 mr-2">Items per page:</label>
          <input
            type="number"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border rounded p-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3.5 px-4 text-sm font-normal text-left">Nom de l'Étage</th>
                <th className="px-4 py-3.5 text-sm font-normal text-left">Rangée</th>
                <th className="px-4 py-3.5 text-sm font-normal text-left">Société</th>
                <th className="px-4 py-3.5 text-sm font-normal text-left">Site</th>
                <th className="px-4 py-3.5 text-sm font-normal text-left">Zone</th>
                <th className="px-4 py-3.5 text-sm font-normal text-left">Allée</th>
                <th className="px-4 py-3.5 text-sm font-normal text-left">Rack</th>
                <th className="px-4 py-3.5 text-sm font-normal text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEtages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-sm text-center text-gray-500">
                    Aucun étage trouvé.
                  </td>
                </tr>
              ) : (
                filteredEtages.map((etage) => (
                  <tr key={etage.etageId} className="even:bg-blue-50">
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      {etage.etageNom}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      {etage.rangee}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      {etage.societe}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      {etage.site}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      {etage.zone}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      {etage.allee}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      {etage.rack}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <button>
                        <FaEdit size={20} color="green" className="mr-1" />
                      </button>
                      <button>
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
            style={{ cursor: "pointer" }}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer"
          >
            <FaChevronLeft className='w-5 h-5 ' />
            <span>Précédent</span>
          </button>

          <div className="items-center hidden md:flex gap-x-3">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-2 py-1 text-sm rounded-md ${currentPage === number ? "text-blue-500 bg-blue-100/60 dark:bg-gray-800" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"}`}
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
            <FaChevronRight className='w-5 h-5 ' />
          </button>
        </div>
      </section>
        </>
    )
}
export default EtagesTable;