import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Login from './Login/Login';
import GridLoader from 'react-spinners/GridLoader'
import Sidebar from './layout/Sidebar';
import Footer from './layout/Footer';
import SocietesTable from './Pages/Societes/SocietesTable';
import SitesList from './Pages/Sites/SitesList';
import SitesTable from './Pages/Sites/SitesTable';
import ZonesList from './Pages/Zones/ZonesList';
import ZonesTable from './Pages/Zones/ZonesTable';
import AlleesTable from './Pages/Allees/AlleesTable';
import AlleesList from './Pages/Allees/AlleesList';
import RacksTable from './Pages/Rack/RacksTable';
import RacksList from './Pages/Rack/RacksList';
import RangeTable from './Pages/Range/RangeTable';
import EtagesTable from './Pages/Etage/EtagesTable';


const App: React.FC = () => {

 //Utilisation de la fonction useLocation pour obtenir l'emplacement actuel du navigateur.
  const location = useLocation()
  // Vérifie si la route actuelle est celle de Login
  const isLoginPage = location.pathname === '/';
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //Simulate a loading delay
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className='flex h-screen justify-center item-center translate-y-32'>
         <GridLoader size={60} color={"#123abc"} loading={loading} />
      </div>
    )
  }

   
  return (
   <div className='flex h-screen'>
    {/* Affiche la Sidebar uniquement si ce n'est pas la page de Login */}
    {!isLoginPage && <Sidebar />}
    <div className='flex-1 overflow-y-auto'>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/sitestable' element={<SitesTable />} />
        <Route path='/societestable' element={<SocietesTable />} />
        <Route path="/societes/:societeId/sites" element={<SitesList />} />
        <Route path="/zones/:siteId" element={<ZonesList />} />
        <Route path='/zonestable' element={<ZonesTable />} />
        <Route path='/allees/:zoneId' element={<AlleesList />} />
        <Route path='/alleestable' element={<AlleesTable />} />
        <Route path='/rackstable' element={<RacksTable/>} />
        <Route path='/rackslist/:alleeId' element={<RacksList/>} />
        <Route path='/rangestable' element={< RangeTable/>} />
        <Route path='/etagestable' element={< EtagesTable/>} />
      </Routes>
     {/* Affiche le Footer uniquement si ce n'est pas la page de Login */}
    {!isLoginPage && <Footer />} 
    </div>
   </div>
  );
};


// Wrapper pour utiliser useLocation dans App
const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;