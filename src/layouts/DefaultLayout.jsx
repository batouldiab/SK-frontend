import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";

const DefaultLayout = () => {
  const navigate = useNavigate();
  const menuItems = [
    { label: "Jobs Across ESCWA countries", icon: "pi pi-fw pi-home", command: () => navigate("/") },
    { 
        label: "Green Jobs",   
        icon: "pi pi-fw pi-file", 
        items: [
                {
                    label: 'Overview in Arab Region',
                    icon: 'pi pi-chart-bar',
                    command: () => navigate("/greenOverview")
                },
                {
                    label: 'Explore Green Occupations',
                    icon: 'pi pi-search',
                    command: () => navigate("/green")
                },
                {
                    label: 'Green Jobs in Energy Sector ',
                    icon: 'pi pi-bolt',
                    command: () => navigate("/green")
                }
              ],
    },
        
    { 
        label: "Benchmarking",   
        icon: "pi pi-fw pi-file",
        items: [
                {
                    label: 'Reports',
                    icon: 'pi pi-chart-line',
                    command: () => navigate("/benchmarking")
                },
                {
                    label: 'Analytics',
                    icon: 'pi pi-chart-pie',
                    command: () => navigate("/benchmarking")
                }
              ],
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm dark:bg-slate-900">
        <Menubar model={menuItems} className="!border-none !rounded-none" />
      </div>

      {/* Page content */}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
