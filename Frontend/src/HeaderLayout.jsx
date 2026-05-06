import Header from "./Header";
import { Outlet } from "react-router-dom";

const HeaderLayout = () => {
  return (
    <div className="absolute flex flex-col items-center h-full w-full gap-2">
      <Header />
      <div className="h-full w-full flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default HeaderLayout;