import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './index.css'
import ReactDOM from "react-dom/client";
import App from './App';
import Login from './Login';
import SignUp from './SignUp';
import User from './User';
import Report from './Report';
import Doctors from './Doctors';

const AppLayout = () => {
  return (
    <div>
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
      { path: "/User", element: <User/>},
      { path: "/Report", element: <Report/>},
      { path: "/Doctor", element: <Doctors/>}
      // { path: "/Login", element: <LoginAndRegister /> },
      // { path: "/LearnMore", element: <LearnMore /> },
      // {
      //   element: <HeaderLayout />,
      //   children: [
      //     { path: "/User", element: <User /> },
      //     {
      //       path: "/GroupDetail/:title",
      //       element: <GroupDetail />,
      //       children: [
      //         { index: true, element: <AddPayment /> },
      //         { path: "paymentApprovals", element: <PaymentApprovals /> },
      //         { path: "membersList", element: <MembersList /> },
      //         { path: "computeSplit", element: <ComputeSplit /> }
      //       ],
      //     },
      //   ],
      // },
    ],
  },
]);

const r = ReactDOM.createRoot(document.getElementById("root"));
r.render(<RouterProvider router={appRouter} />);