import { useEffect, useState } from "react";
import axios from "axios";
import BookingModal from "./BookingModal";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [place, setPlace] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Fetch doctors
    const fetchDoctors = async () => {
        try {
            setLoading(true);
    
            const response = await axios.get(
                "http://localhost:8000/api/v1/users/getDoctors",
                {
                    params: {
                        place,
                        specialization,
                    },
                }
            );
    
            setDoctors(response.data.data);
    
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Filter logic
    useEffect(() => {
        let filtered = [...doctors]; // ✅ FIX
    
        if (place) {
            filtered = filtered.filter((doc) =>
                doc.place?.toLowerCase().includes(place.toLowerCase())
            );
        }
    
        if (specialization) {
            filtered = filtered.filter((doc) =>
                doc.specialization
                    ?.toLowerCase()
                    .includes(specialization.toLowerCase())
            );
        }
    
        setFilteredDoctors(filtered);
    }, [place, specialization, doctors]);

    return (
        <div className="h-full w-[90%] bg-[#5a06f638] p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Find Doctors
                </h1>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-3 gap-4">
                    
                    {/* Place Filter */}
                    <input
                        type="text"
                        placeholder="Filter by place..."
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                        className="border p-2 rounded-lg"
                    />

                    {/* Specialization Filter */}
                    <input
                        type="text"
                        placeholder="Filter by specialization..."
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="border p-2 rounded-lg"
                    />

                    {/* Reset Button */}
                    <button
                        onClick={() => {
                            setPlace("");
                            setSpecialization("");
                        }}
                        className="bg-gray-800 text-white rounded-lg"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Doctors List */}
                {loading ? (
                    <p>Loading doctors...</p>
                ) : filteredDoctors.length === 0 ? (
                    <p className="text-gray-500">No doctors found</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                        {filteredDoctors.map((doc) => (
                            <div
                                key={doc._id}
                                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                            >
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Dr. {doc.name}
                                </h2>

                                <p className="text-gray-600 text-sm mt-1">
                                    {doc.email}
                                </p>

                                <p className="mt-2">
                                    <span className="font-medium">
                                        Specialization:
                                    </span>{" "}
                                    {doc.specialization || "N/A"}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Location:
                                    </span>{" "}
                                    {doc.place || "N/A"}
                                </p>

                                {/* Optional: Book button */}
                                <button
                                    onClick={() => setSelectedDoctor(doc)}
                                    className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                    >
                                    Book Appointment
                                    </button>
                            </div>
                        ))}
                    </div>
                )}

                        {selectedDoctor && (
                        <BookingModal
                            doctor={selectedDoctor}
                            onClose={() => setSelectedDoctor(null)}
                            onSuccess={() => {
                            alert("Appointment booked successfully");
                            }}
                        />
                        )}
            </div>
        </div>
    );
};

export default Doctors;