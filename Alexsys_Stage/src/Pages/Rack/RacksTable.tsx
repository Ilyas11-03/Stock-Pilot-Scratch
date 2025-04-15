import React, {useEffect, useState} from "react";
import { Rack, RackRequest } from "./_request";
import Swal from "sweetalert2";
import Header from "../../layout/Header";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const RacksTable: React.FC = () => {
  // const { alleeId } = useParams<{ alleeId: string }>();
    //Etat pour stocker la liste des racks
    const [racks, setRacks] = useState<Rack[]>([]);
    //
    const [searchTerm , setSearchTerm] = useState("");


    const clientId = localStorage.getItem("clientId");

    //Fonction pour récupérer tous les racks
    const fetchRacks = async () => {
        try {
            const data = await RackRequest.getAllRacksByClientId(Number(clientId))
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
    }, [])

    //Filtrer les racks
    const filteredRacks = racks.filter((rack) =>
      rack.rackNom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
      <>
       <Header/>
       <section className="container px-4 mx-auto mt-6">
  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
    Liste des Racks
  </h1>

   {/* Search bar */}
   <div className="flex justify-between mb-4 animate-fadeIn border-blue-500 border-2 bg-gray-100 rounded-2xl p-4 animate-border">
          <input
            type="text"
            placeholder="Rechercher un rack..."
            className="w-full max-w-xs h-10 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
  </div>
  
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white divide-y divide-gray-200 dark:divide-gray-700 border">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="py-3.5 px-4 text-sm font-normal text-left">Nom du Rack</th>
          <th className="px-4 py-3.5 text-sm font-normal text-left">Allées</th>
          <th className="px-4 py-3.5 text-sm font-normal text-left">Zones</th>
          <th className="px-4 py-3.5 text-sm font-normal text-left">Sites</th>
          <th className="px-4 py-3.5 text-sm font-normal text-left">Sociétés</th>
          <th className="px-4 py-3.5 text-sm font-normal text-left">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
        {racks.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-4 py-4 text-sm text-center text-gray-500">
              Aucun rack trouvé.
            </td>
          </tr>
        ) : (
          racks.map((rack) => (
            <tr key={rack.rackId} className="even:bg-blue-50">
              <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                {rack.rackNom}
              </td>
              <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                {rack.societe}
              </td>
              <td className="px-4 py-4 text-sm whitespace-nowrap">
                {rack.site}
              </td>
              <td className="px-4 py-4 text-sm whitespace-nowrap">
                {rack.zone}
              </td>
              <td className="px-4 py-4 text-sm whitespace-nowrap">
                {rack.allee}
              </td>
              <td className="px-4 py-4 text-sm whitespace-nowrap">
            <button
                                  
                                   
                                  >
                                    <FaEdit size={20} color="green"  className="mr-1" />
                                    
                                  </button>
                                  <button
                                  
                                  
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
</section>

        </>
      );
    };

    export default RacksTable