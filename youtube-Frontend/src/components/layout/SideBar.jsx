import { House, Play, TvMinimalPlay, CircleUser } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const sideBarItems = [
  { id: 1, name: "Home", icon: <House />, path: "/" },
  { id: 2, name: "Shorts", icon: <Play />, path: null },
  { id: 3, name: "Subscriptions", icon: <TvMinimalPlay />, path: null },
  { id: 4, name: "You", icon: <CircleUser />, path: "/profile" },
];

const itemClass =
  "px-1 py-4 flex flex-col items-center space-y-2 rounded-lg duration-150 hover:bg-[#272727] cursor-pointer";

const SideBar = () => {
  return (
    <ul className="sideBar h-full inline-block pl-1 pr-5 pt-4">
      {sideBarItems.map((item) => (
        <li key={item.id}>
          {item.path ? (
            <NavLink
              to={item.path}
              end
              className={({ isActive }) =>
                `${itemClass} ${isActive ? "bg-[#272727]" : ""}`
              }
            >
              <span>{item.icon}</span>
              <span className="text-[10px]">{item.name}</span>
            </NavLink>
          ) : (
            <div className={itemClass}>
              <span>{item.icon}</span>
              <span className="text-[10px]">{item.name}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SideBar;