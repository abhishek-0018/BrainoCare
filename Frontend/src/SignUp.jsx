import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const [role, setRole] = useState("Patient");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [password, setPassword] = useState("");
    const [place, setPlace] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !name || !password) {
            alert("Please fill all fields.");
            return;
        }

        const userData = {
            email,
            name,
            password,
            role: role.toLowerCase(),
            place,
            specialization
        };

        try {
            const response = await axios.post("http://localhost:8000/api/v1/users/register", userData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.success) {
                localStorage.setItem("userData", JSON.stringify(response.data.data.user));
                localStorage.setItem("accessToken", response.data.data.accessToken);
                navigate("/");
            }
        } catch (error) {
            console.error("Error:", error.response?.data?.message || "Something went wrong");
            alert(error.response?.data?.message || "Error during authentication");
        }
    };

    return (
        <div className="absolute w-full max-w-lg bg-[#5a06f638] border-white border p-10 rounded-2xl shadow-xl">
            <div className="w-full max-w-lg  p-10 rounded-2xl shadow-xl">
                {/* Title */}
                <h2 className="text-white text-3xl font-bold text-center mb-6">Sign Up</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name Input */}
                    <div className="w-full bg-gradient-to-b from-violet-100 to-slate-200 rounded-md flex items-center px-4">
                        <input
                            placeholder="Full Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-3 w-full bg-transparent outline-none placeholder-gray-400 text-gray-600"
                            autoComplete="off"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="w-full bg-gradient-to-b from-violet-100 to-slate-200 rounded-md flex items-center px-4">
                        <input
                            placeholder="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-3 w-full bg-transparent outline-none placeholder-gray-400 text-gray-600"
                            autoComplete="off"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="w-full bg-gradient-to-b from-violet-100 to-slate-200 rounded-md flex items-center px-4">
                        <input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-3 w-full bg-transparent outline-none placeholder-gray-400 text-gray-600"
                            autoComplete="off"
                        />
                    </div>

                    {role==="Doctor"&&<div className="w-full bg-gradient-to-b from-violet-100 to-slate-200 rounded-md flex items-center px-4">
                        <input
                            placeholder="Specialization"
                            type="text"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className="p-3 w-full bg-transparent outline-none placeholder-gray-400 text-gray-600"
                            autoComplete="off"
                        />
                    </div>}

                    <div className="w-full bg-gradient-to-b from-violet-100 to-slate-200 rounded-md flex items-center px-4">
                        <input
                            placeholder="Place"
                            type="text"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            className="p-3 w-full bg-transparent outline-none placeholder-gray-400 text-gray-600"
                            autoComplete="off"
                        />
                    </div>

                    {/* User Role Selection */}
                    <div className="flex gap-5 justify-center my-5">
                        <button
                            type="button"
                            className={`w-1/2 py-3 rounded-full font-semibold transition-all ${
                                role === "Patient"
                                    ? "bg-gradient-to-b bg-gray-700 text-white"
                                    : "bg-gradient-to-b bg-gray-300 text-black hover:bg-gray-400"
                            }`}
                            onClick={() => setRole("Patient")}
                        >
                            Patient
                        </button>
                        <button
                            type="button"
                            className={`w-1/2 py-3 rounded-full font-semibold transition-all ${
                                role === "Doctor"
                                ? "bg-gradient-to-b bg-gray-700 text-white"
                                : "bg-gradient-to-b bg-gray-300 text-black hover:bg-gray-400"
                            }`}
                            onClick={() => setRole("Doctor")}
                        >
                            Doctor
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:bg-violet-900"
                        onClick={handleSubmit}
                    >
                        Sign Up as {role}
                    </button>
                </form>

                <div>
                    Already have account?{" "}
                    <button className="cursor-pointer transition duration-300 ease-in-out text-indigo-700" onClick={()=>{navigate("/")}}>Click Here</button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;