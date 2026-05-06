import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './index.css'
import ReactDOM from "react-dom/client";
import App from './App';
import Login from './Login';
import SignUp from './SignUp';
import User from './User';
import Report from './Report';
import Doctors from './Doctors';
import HeaderLayout from './HeaderLayout';
import Grainient from './Grainient';

const AppLayout = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center relative'>
       <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <Grainient color1="#FF9FFC"
    color2="#5227FF"
    color3="#B497CF"
    timeSpeed={0.9}
    colorBalance={0}
    warpStrength={1}
    warpFrequency={5}
    warpSpeed={2}
    warpAmplitude={50}
    blendAngle={0}
    blendSoftness={0.05}
    rotationAmount={500}
    noiseScale={2}
    grainAmount={0.1}
    grainScale={2}
    grainAnimated={false}
    contrast={1.5}
    gamma={1}
    saturation={1}
    centerX={0}
    centerY={0}
    zoom={0.9} />
      </div>
      <Outlet />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/Signup", element: <SignUp/>},
      { element: <HeaderLayout />,
      children: [{ path: "/User", element: <User/>},
      { path: "/Report", element: <Report/>},
      { path: "/Doctor", element: <Doctors/>}]}
    ],
  },
]);

const r = ReactDOM.createRoot(document.getElementById("root"));
r.render(<RouterProvider router={appRouter} />);