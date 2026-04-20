import React, { useEffect, useRef, useState } from 'react';
import Header from '../layout/Header';
import ApexCharts from 'react-apexcharts'
import { Societe, Site, Zone, DashboardRequests, Allee, Rack, Etage } from './_requests';
import Swal from 'sweetalert2';
import { ApexOptions } from 'apexcharts';
import { FaBuilding, FaLayerGroup, FaLocationArrow, FaMap, FaMapMarkedAlt, FaMapMarkerAlt, FaRoad, FaServer } from 'react-icons/fa';
import { PieChartLabels } from './RosenChart';

const Dashboard: React.FC = () => {
  
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [allees, setAllees] = useState<Allee[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [range, setRange] = useState<Range[]>([]);
  const [etage, setEtage] = useState<Etage[]>([]);

  useEffect(() => {
    
    const fetchData = async () => {

      try {
        const societesData = await DashboardRequests.getAllSocietes();
        const sitesData = await DashboardRequests.getAllSites();
        const zonesData = await DashboardRequests.getAllZones();
        const alleesData = await DashboardRequests.getAllAllees();
        const racksData = await DashboardRequests.getAllRacks();
        const rangeData = await DashboardRequests.getAllRanges();
        const etageData = await DashboardRequests.getAllEtages();
        
        setSocietes(societesData);
        setSites(sitesData);
        setZones(zonesData);
        setAllees(alleesData);
        setRacks(racksData);
        // setRange(rangeData);
        setEtage(etageData);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération des données.',
        });
      }
    };

    fetchData()
  }, []);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar'
    },
    xaxis: {
      categories: ['Sociétés', 'Sites', 'Zones', 'Allées', 'Racks', 'Etages']
    }
  }

  const chartSeries = [
    {
      name: 'Count',
      data  : [societes.length, sites.length, zones.length, allees.length, racks.length, etage.length]
    }
  ]
 

  return (
   <>
    <Header/>    
    <section className="container px-4 mx-auto mt-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Dashboard
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <ApexCharts
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={350}
          />
        </div>
      </section>
      <PieChartLabels/>

      <div className="m-10 grid gap-5 grid-cols-1 sm:grid-cols-3 mx-auto max-w-screen-lg">
  <div className="px-4 py-6 shadow-lg shadow-blue-100">
    <FaBuilding size={60} className='rounded-xl bg-blue-50 p-4 text-blue-500'/>
    <p className="mt-4 font-medium">Sociétés</p>
    <p className="mt-2 text-xl font-medium">
      {societes.length}
      <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </p>
    <span className="text-xs text-gray-400">+4.9%</span>
  </div>

  <div className="px-4 py-6 shadow-lg shadow-blue-100">
    <FaMapMarkerAlt size={60} className='rounded-xl bg-rose-50 p-4 text-rose-500'/>
    <p className="mt-4 font-medium">Sites</p>
    <p className="mt-2 text-xl font-medium"> 
      {sites.length}
      <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </p>
    <span className="text-xs text-gray-400">+4.9%</span>
  </div>
  <div className="px-4 py-6 shadow-lg shadow-blue-100">
    <FaMap size={60} className='rounded-xl bg-green-50 p-4 text-green-500'/>
    <p className="mt-4 font-medium">Zones</p>
    <p className="mt-2 text-xl font-medium">
      {zones.length}
      <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </p>
    <span className="text-xs text-gray-400">+4.9%</span>
  </div>
</div>

<div className="m-10 grid gap-5 sm:grid-cols-3  mx-auto max-w-screen-lg">
  <div className="px-4 py-6 shadow-lg shadow-blue-100">
    <FaRoad size={60} className='rounded-xl bg-blue-50 p-4 text-blue-500'/>
    <p className="mt-4 font-medium">Allées</p>
    <p className="mt-2 text-xl font-medium">
      {allees.length}
      <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </p>
    <span className="text-xs text-gray-400">+4.9%</span>
  </div>
  <div className="px-4 py-6 shadow-lg shadow-blue-100">
     <FaServer size={60} className='rounded-xl bg-rose-50 p-4 text-rose-500'/>
    <p className="mt-4 font-medium">Racks</p>
    <p className="mt-2 text-xl font-medium">
      {racks.length}
      <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </p>
    <span className="text-xs text-gray-400">+4.9%</span>
  </div>
  <div className="px-4 py-6 shadow-lg shadow-blue-100">
    <FaLayerGroup size={60} className='rounded-xl bg-green-50 p-4 text-green-500'/>
    <p className="mt-4 font-medium">Etages</p>
    <p className="mt-2 text-xl font-medium">
      {etage.length}
      <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </p>
    <span className="text-xs text-gray-400">+4.9%</span>
  </div>
</div>

   </>
  );
};

export default Dashboard;