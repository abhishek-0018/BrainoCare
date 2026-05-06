import { useState } from "react";
import axios from "axios";

const BookingModal = ({ doctor, onClose, onSuccess }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const accessToken = localStorage.getItem("accessToken");

    const handleSubmit = async () => {
        if (!date || !time) {
            alert("Date and time are required");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                "http://localhost:8000/api/v1/appointments/bookAppointment",
                {
                    doctorId: doctor._id,
                    date,
                    time,
                    note: notes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            onSuccess(); // refresh list or show toast
            onClose();

        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            
            {/* Modal Box */}
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

                <h2 className="text-xl font-semibold mb-4">
                    Book Appointment with Dr. {doctor.name}
                </h2>

                {/* Date */}
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                />

                {/* Time */}
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                />

                {/* Notes */}
                <textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                />

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {loading ? "Booking..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;