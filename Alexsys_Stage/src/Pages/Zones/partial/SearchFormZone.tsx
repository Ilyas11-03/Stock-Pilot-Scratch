// import React, { useEffect, useState } from 'react';
// import AddZones from './AddZones';
// import { Zone } from '../_request';

// interface SearchFormZoneProps {
//   zones: Zone[];
//   onZoneAdded: () => void;
//   onFilteredZones: (filteredZones: Zone[]) => void;
//   siteId: number;
// }

// const SearchFormZone: React.FC<SearchFormZoneProps> = ({ zones, onZoneAdded, onFilteredZones, siteId }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const filteredZones = zones.filter((zone) =>
//       zone.zoneNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       zone.site.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     onFilteredZones(filteredZones);
//   }, [searchTerm, zones, onFilteredZones]);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   return (
//     <div className="flex justify-between mb-4 animate-fadeIn border-blue-500 border-2 bg-gray-200 rounded-2xl p-4 animate-border">
//       <input
//         type="text"
//         placeholder="Rechercher une zone"
//         value={searchTerm}
//         className="w-full max-w-xs h-14 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//         onChange={handleSearchChange}
//       />
//       <AddZones onZoneAdded={onZoneAdded} siteId={siteId} />
//     </div>
//   );
// };

// export default SearchFormZone;