import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import { RangeRequests, Range } from "./_request";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import Header from "../../layout/Header";
import AddRange from "./partial/AddRange";

const RangeTable: React.FC = () => {
    // Récupérez le clientId depuis le localStorage
    const clientId = Number(localStorage.getItem('clientId'));
    console.log("ClientId:", clientId);
     // État pour la liste de rangées
     const [ranges, setRanges] = useState<Range[]>([])
     const [filteredRanges, setFilteredRanges] = useState<Range[]>([])
     // État pour une rangée sélectionnée
     const [selectedRange, setSelectedRange] = useState<Range | null>(null)
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsPerPage, setItemsPerPage] = useState(10);
     const [searchTerm, setSearchTerm] = useState("");

     // Charger les données au premier rendu
     useEffect(() => {
        //Fonction pour récupérer les rangées de l'API par le clientId
        const fetchRanges = async () => {
            try {
                const data = await RangeRequests.getRangesByClientId(clientId)
                setRanges(data)
                setFilteredRanges(data)
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de la récupération des rangées.',
                })
            }
        }

        fetchRanges()
     }, [clientId]);

     //Fonction pour ajouter une nouvelle rangée à l'état
     const addRangeToState = (newRange: Range) => {
        setRanges((prevRanges) => [newRange, ...prevRanges])
        setFilteredRanges((prevRanges) => [newRange, ...prevRanges])
        setCurrentPage(1)
     }

     //Fonction pour fermer le modal
     const handleCloseModal = () => {
        setSelectedRange(null)
     }

     const handleDeleteRange = async (rangeId: number) => {
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
                await RangeRequests.deleteRange(rangeId)
                setRanges((prevRanges) => prevRanges.filter((range) => range.rangéeId !== rangeId))
                setFilteredRanges((prevRanges) => prevRanges.filter((range) => range.rangéeId !== rangeId))
                Swal.fire('Supprimé!', 'La rangée a été supprimée.', 'success');
      } catch (error) {
        Swal.fire('Erreur!', "La rangée n'a pas été supprimée.", 'error');
        }
     }
} 

 // Calculer les rangées à afficher pour la pagination
 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentRanges = filteredRanges.slice(
    Math.max(0, indexOfFirstItem),
    Math.min(indexOfLastItem, filteredRanges.length)
 );

   // Générer les numéros de page
   const pageNumbers = []
   for (let i = 1; i <= Math.ceil(filteredRanges.length / itemsPerPage); i++) {
    pageNumbers.push(i)
   }

     // Réinitialiser la page si la liste change
     useEffect(() => {
        if (currentPage > Math.ceil(filteredRanges.length / itemsPerPage)) {
            setCurrentPage(1)
        }
     }, [filteredRanges, currentPage, itemsPerPage])

     //Fonction pour changer de page
     const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
     };
    
     return (
        <>
          <Header />
      <section className="container px-4 mx-auto mt-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Liste des Rangées
        </h1>

        {/* Search bar */}
        <div className="flex justify-between mb-4 animate-fadeIn border-blue-500 border-2 bg-gray-100 rounded-2xl p-4 animate-border">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une rangée..."
            className="px-3 py-2 border rounded-md w-full dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700"
          />
          <button onClick={() => setSelectedRange(null)} className="px-4 py-2 text-white bg-blue-500 rounded-md">
            Ajouter une rangée
          </button>
        </div>

        <div className="font-[sans-serif] overflow-x-auto">
          <table className="min-w-full bg-white border divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 whitespace-nowrap">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-white">Nom</th>
                <th className="p-4 text-left text-sm font-medium text-white">Rack</th>
                <th className="p-4 text-left text-sm font-medium text-white">Allée</th>
                <th className="p-4 text-left text-sm font-medium text-white">Zone</th>
                <th className="p-4 text-left text-sm font-medium text-white">Site</th>
                <th className="p-4 text-left text-sm font-medium text-white">Société</th>
                <th className="p-4 text-left text-sm font-medium text-white">Actions</th>
              </tr>
            </thead>

            <tbody className="whitespace-nowrap">
              {currentRanges.map((range) => (
                <tr className="even:bg-blue-50" key={range.rangéeId}>
                  <td className="p-4 text-sm text-black">{range.rangéeNom}</td>
                  <td className="p-4 text-sm text-black">{range.rack}</td>
                  <td className="p-4 text-sm text-black">{range.allee}</td>
                  <td className="p-4 text-sm text-black">{range.zone}</td>
                  <td className="p-4 text-sm text-black">{range.site}</td>
                  <td className="p-4 text-sm text-black">{range.societe}</td>
                  <td className="p-4">
                    <button onClick={() => setSelectedRange(range)} className="">
                      <FaEdit size={25} color="green" />
                    </button>
                    <button onClick={() => handleDeleteRange(range.rangéeId)} className="mr-2">
                      <FaTrash size={25} color="red" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* {selectedRange && (
                <EditRange
                  range={selectedRange}
                  onRangeUpdated={handleRangeUpdate} // Passer la fonction ici
                  onClose={handleCloseModal}
                />
              )} */}
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
            <FaChevronLeft className='w-5 h-5' />
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
            <FaChevronRight className='w-5 h-5' />
          </button>
        </div>

        {/* Inputs for currentPage and itemsPerPage */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-x-3">
            <label htmlFor="currentPage" className="text-sm text-gray-700 dark:text-gray-200">Page actuelle:</label>
            <input
              type="number"
              id="currentPage"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="px-2 py-1 text-sm border rounded-md dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="flex items-center gap-x-3">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-700 dark:text-gray-200">Éléments par page:</label>
            <input
              type="number"
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 text-sm border rounded-md dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </section>
        </>
     )
    }
export default RangeTable;