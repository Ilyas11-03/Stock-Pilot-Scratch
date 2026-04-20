import React, { useEffect, useState } from "react";
import AddSociete from "../partial/AddSocietes";
import { Societe } from "../_request";

interface SearchFormSocieteProps {
    societes: Societe[];
    onSocieteAdded: (newSociete: Societe) => void;
    onSearchTermChange: (searchTerm: string) => void;
} 

const SearchFormSociete: React.FC<SearchFormSocieteProps> = ({ onSocieteAdded, onSearchTermChange}) => {
    
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Gérer le changement dans le champ de recherche
        const term = e.target.value;
        setSearchTerm(term) // Mettre à jour le terme de recherche
        onSearchTermChange(term) // Appeler la fonction parent pour mettre à jour le terme de recherche
    }

return (
    <div className="flex justify-between mb-4 animate-fadeIn border-blue-500 border-2 bg-gray-100 rounded-2xl p-4 animate-border">
         <input
        type="text"
        placeholder="Rechercher une société"
        value={searchTerm}
        className="w-full max-w-xs h-14 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        onChange={handleSearchChange}
      />
      <AddSociete onSocieteAdded={onSocieteAdded} />
    </div>

)
}

export default SearchFormSociete;