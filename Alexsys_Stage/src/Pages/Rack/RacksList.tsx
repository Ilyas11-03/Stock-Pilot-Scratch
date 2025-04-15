import React, {useEffect, useState} from "react";
import { Rack, RackRequest } from "./_request";
import Swal from "sweetalert2";
import Header from "../../layout/Header";
import { useParams } from "react-router-dom";

const RacksTable: React.FC = () => {
  
    const { alleeId } = useParams<{ alleeId: string }>();
    //Etat pour stocker la liste des racks
    const [racks, setRacks] = useState<Rack[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    //Fonction pour récupérer tous les racks
    const fetchRacks = async () => {
        try {
            const data = await RackRequest.getRacksByAlleeId(Number(alleeId))
            setRacks(data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la récupération des racks.',
            })
        }
    };

    useEffect(() => {
        fetchRacks()
    }, [alleeId])

    // Filtrer les racks
  const filteredRacks = racks.filter((rack) =>
    rack.rackNom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour changer de page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Générer les numéros de page
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredRacks.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

    return (
      <>
      <Header/>
        <section className="container px-4 mx-auto mt-6">
        
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Liste des Racks
          </h1>
  
          {/* Tableau des racks */}
          <div className="flex flex-col mt-6">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          Nom du Rack
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          Allée
                        </th>
                        <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          Société
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          Site
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          Zone
                        </th>
                        
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                      {filteredRacks.map((rack) => (
                        <tr key={rack.rackId}>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                            {rack.rackNom}
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            {rack.allee}
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            {rack.zone}
                          </td>
                          <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                            {rack.societe}
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            {rack.site}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
      );
    };

    export default RacksTable