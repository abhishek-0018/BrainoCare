import { useNavigate, Link } from "react-router-dom";
import axios from "axios";


const Header = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const Logout = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/v1/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(
        "Error while logging out:",
        error.response?.data?.message || error.message
      );
    }
    localStorage.removeItem("userData");
    localStorage.removeItem("currentGroup");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("joinedGroups");

    navigate("/");
  };
  return (
    <div className="flex justify-between my-3 h-20 w-[90%] shadow-lg bg-[#5a06f638] text-white border-2 rounded-4xl">
        <div className="text-4xl ml-10 p-4">
            NEUROFLOW
        </div>
      <div>
        <ul className="flex p-4 items-center">
          <Link
            to={"/User"}
            className="hover:scale-105 transition-transform duration-300"
          >
            <li className="px-4">Home</li>
          </Link>
          <li className="px-4">About Me</li>
          <li className="px-4">Contact Me</li>
          <button
            className="bg-[#100E0E] transition duration-300 ease-in-out border-2 border-white rounded-4xl h-[50px] w-[150px] text-white hover:bg-white hover:text-black hover:scale-105"
            onClick={Logout}
          >
            Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Header;