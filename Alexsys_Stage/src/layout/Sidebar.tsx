import React, { useState } from 'react';
import stockPilotLogo from "../assets/Stock_Pilot_Icon.svg";
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { FaBuilding, FaMapMarkerAlt, FaMap, FaRoad, FaListUl, FaServer, FaLayerGroup } from 'react-icons/fa';
import { FiMenu } from "react-icons/fi";

const Sidebar: React.FC = () => {
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} bg-gray-800 text-white`}>
      <aside className="flex flex-col w-full">
        {/* Logo & Toggle Button */}
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <img className="w-35 h-16" src={stockPilotLogo} alt="Logo"/>}
          <button
            onClick={toggleSidebar}
            className="p-2 text-white hover:bg-gray-700 rounded-lg"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4">
          <SidebarLink to="/dashboard" icon={<MdDashboard />} label="Dashboard" isCollapsed={isCollapsed} isActive={isActive("/dashboard")} />
          <SidebarLink to="/societestable" icon={<FaBuilding />} label="Sociétés" isCollapsed={isCollapsed} isActive={isActive("/societestable")} />
          <SidebarLink to="/sitestable" icon={<FaMapMarkerAlt />} label="Sites" isCollapsed={isCollapsed} isActive={isActive("/sitestable")} />
          <SidebarLink to="/zonestable" icon={<FaMap />} label="Zones" isCollapsed={isCollapsed} isActive={isActive("/zonestable")} />
          <SidebarLink to="/alleestable" icon={<FaRoad />} label="Allées" isCollapsed={isCollapsed} isActive={isActive("/alleestable")} />
          <SidebarLink to="/rackstable" icon={<FaServer/>} label="Racks" isCollapsed={isCollapsed} isActive={isActive("/rackstable")} />
          <SidebarLink to="/rangestable" icon={<FaListUl />} label="Rangés" isCollapsed={isCollapsed} isActive={isActive("/rangestable")} />
          <SidebarLink to="/etagestable" icon={<FaLayerGroup />} label="Etages" isCollapsed={isCollapsed} isActive={isActive("/etagestable")} />


         
        </nav>
      </aside>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isCollapsed, isActive }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2 mt-2 rounded-md transition-all duration-300 ${
      isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    <div className="text-lg">{icon}</div>
    {!isCollapsed && <span className="ml-4">{label}</span>}
  </Link>
);

export default Sidebar;
