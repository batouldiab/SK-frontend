import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";

const DefaultLayout = () => {
  const navigate = useNavigate();
  const menuItems = [
    { label: "Dashboard", icon: "pi pi-fw pi-home", command: () => navigate("/") },
    { 
        label: "Green",   
        icon: "pi pi-fw pi-file", 
        items: [
                {
                    label: 'Components',
                    icon: 'pi pi-bolt',
                    command: () => navigate("/page1")
                },
                {
                    label: 'Charts',
                    icon: 'pi pi-chart-bar',
                    command: () => navigate("/page1")
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
                    command: () => navigate("/page2")
                },
                {
                    label: 'Analytics',
                    icon: 'pi pi-chart-pie',
                    command: () => navigate("/page2")
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
