import { LayoutDashboard, UploadIcon, ShieldAlert, Camera, HomeIcon} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
  const menuItems = [
    {
      title: "Upload",
      icon: UploadIcon,
      path: "upload",
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "dashboard",
    },
    {
      title: "Detections",
      icon: ShieldAlert,
      path: "detections",
    },
    {
      title: "Cameras",
      icon: Camera,
      path: "cameras",
    },
    {
        title: "Home",
        icon: HomeIcon,
        path: ""
    }
  ];

  return (
    <aside className="h-screen w-72 bg-sidebar text-sidebar-foreground border-r border-white/10 flex flex-col ">
    
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
            {/* Logo */}

          <div>
            <h1 className="text-4xl font-bold">
              Free Flow
            </h1>

            <p className="text-md opacity-70">
              Traffic Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4">
        <ul className="flex flex-col justify-between">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <button className={` w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-primary hover:scale-105 mb-10 cursor-pointer`} onClick={()=>{navigate(`${item.path}`)}}>
                  <Icon size={18} />
                  {item.title}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}