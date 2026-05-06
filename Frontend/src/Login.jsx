import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const action = "login";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("No data collected");
            return;
        }

        const userData = new FormData();
        userData.append("email", email);
        userData.append("password", password);

        const headers = { "Content-Type": "application/json" };
        try {
            const endpoint = "/api/v1/users/login";
            const response = await axios.post(
                `http://localhost:8000${endpoint}`,
                userData,
                { headers }
            );

            if (response.data.success) {
                localStorage.setItem("userData",JSON.stringify(response.data.data.user));
                localStorage.setItem("accessToken", response.data.data.accessToken);
                navigate("/User");
            }
        } catch (error) {
            console.error(
                "Error:",
                error.response?.data?.message || "Something went wrong"
            );
            alert(error.response?.data?.message || "Error during authentication");
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gradient-to-b from-slate-800 to-violet-800 backdrop-blur-md">
            <div className="w-full max-w-lg bg-linear-to-b from-slate-900 to-violet-900 p-10 rounded-2xl shadow-xl">
            <h2 className="text-white text-3xl font-bold text-center mb-6">Login</h2>
                <form
                    className="flex flex-col items-center gap-6 text-amber-50"
                    onSubmit={handleSubmit}
                >
                    <div className="w-[480px] h-[80px] bg-gradient-to-b to-slate-900 from-violet-900 rounded-md flex items-center px-4 mt-[80px]">
                        <input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-3 w-full bg-transparent outline-none text-amber-50"
                            autoComplete="off"
                        />
                    </div>

                    <div className="w-[480px] h-[80px] bg-gradient-to-b to-slate-900 from-violet-900 rounded-md flex items-center px-4">
                        <input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-3 w-full bg-transparent outline-none text-amber-50"
                            autoComplete="off"
                        />
                    </div>

                    <div className="mt-3 text-gray-400 text-[16px]">
                        Lost Password?{" "}
                        <span className="cursor-pointer text-blue-500">Click here</span>
                    </div>
                    <button
                        type="submit"
                        className="bg-slate-900 text-white text-lg font-semibold py-4 px-10 rounded-xl shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-violet-900"
                        onClick={handleSubmit}
                    >
                        {action}
                    </button>
                </form>
                <div>
                    Don't have account?{" "}
                    <button className="cursor-pointer transition duration-300 ease-in-out text-indigo-700" onClick={()=>{navigate("/Signup")}}>Click Here</button>
                </div>
            </div>
        </div>
    );
};

export default Login;