import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const User = () => {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");

    // Fetch user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");

        if (!storedUser) {
            navigate("/");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (error) {
            console.error("Invalid JSON:", error);
            localStorage.removeItem("userData");
            navigate("/");
        }
    }, []);

    // Fetch data
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // Appointments
                const apptRes = await axios.get(
                    "http://localhost:8000/api/v1/appointments/getUserAppointments",
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );

                setAppointments(apptRes.data.data);

                // Reports (only for patient)
                if (user.role === "patient") {
                    const reportRes = await axios.get(
                        "http://localhost:8000/api/v1/reports/getReportsByUserId",
                        {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }
                    );

                    setReports(reportRes.data.data);
                }

            } catch (error) {
                console.error(error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Doctor response handler
    const handleStatusUpdate = async (appointmentId, status) => {
        try {
            await axios.patch(
                `http://localhost:8000/api/v1/appointments/updateStatus/${appointmentId}`,
                { status },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            // Update UI
            setAppointments((prev) =>
                prev.map((appt) =>
                    appt._id === appointmentId
                        ? { ...appt, status }
                        : appt
                )
            );
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    if (!user) return <p className="text-center mt-20">Redirecting...</p>;

    if (loading) return <p className="text-center mt-20">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-5xl mx-auto">
      
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {user.name}
              </h1>
      
              {user.role === "patient" && (
                <button
                  onClick={() => navigate("/Report")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                >
                  Upload MRI
                </button>
              )}
            </div>
      
            {/* ================= PATIENT VIEW ================= */}
            {user.role === "patient" && (
              <>
                {/* Appointments */}
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Upcoming Appointments
                  </h2>
      
                  {appointments.length === 0 ? (
                    <p className="text-gray-500">No appointments found</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {appointments.map((appt) => (
                        <div
                          key={appt._id}
                          className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                        >
                          <p className="font-semibold text-gray-800">
                            Dr. {appt.doctorId?.name}
                          </p>
      
                          <p className="text-gray-600 text-sm mt-1">
                            {new Date(appt.date).toDateString()} • {appt.time}
                          </p>
      
                          <span
                            className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                              appt.status === "Approved"
                                ? "bg-green-100 text-green-700"
                                : appt.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
      
                {/* Reports */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Reports
                  </h2>
      
                  {reports.length === 0 ? (
                    <p className="text-gray-500">No reports yet</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {reports.map((report) => (
                        <div
                          key={report._id}
                          className="bg-white p-4 rounded-xl shadow"
                        >
                          <p className="text-gray-800 font-semibold">
                            {report.tumorType || "Result"}
                          </p>
      
                          <p className="text-sm text-gray-600 mt-1">
                            Confidence:{" "}
                            <span className="font-medium">
                              {report.confidence ?? "N/A"}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                <button
                  onClick={() => navigate("/Doctor")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                >
                  Find Doctor
                </button>
                <section>
                  
                </section>
              </>
            )}
      
            {/* ================= DOCTOR VIEW ================= */}
            {user.role === "doctor" && (
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Appointment Requests
                </h2>
      
                {appointments.length === 0 ? (
                  <p className="text-gray-500">No appointments</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {appointments.map((appt) => (
                      <div
                        key={appt._id}
                        className="bg-white p-4 rounded-xl shadow"
                      >
                        <p className="font-semibold text-gray-800">
                          {appt.patientId?.name}
                        </p>
      
                        <p className="text-gray-600 text-sm mt-1">
                          {new Date(appt.date).toDateString()} • {appt.time}
                        </p>
      
                        <span
                          className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                            appt.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : appt.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {appt.status}
                        </span>
      
                        {/* Actions */}
                        {appt.status === "Pending" && (
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() =>
                                handleStatusUpdate(appt._id, "Approved")
                              }
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(appt._id, "Rejected")
                              }
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      );
};

export default User;