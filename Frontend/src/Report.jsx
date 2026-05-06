import { useState } from "react";
import axios from "axios";

const Report = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Handle file select
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    // Handle upload
    const handleUpload = async () => {
        if (!file) {
            alert("Please select an image");
            return;
        }
    
        try {
            setLoading(true);
    
            const formData = new FormData();
            formData.append("file", file);
    
            const response = await axios.post(
                "https://anshu370-brain-tumor-detection.hf.space/run/predict",
                formData
            );
    
            console.log(response.data);
            setResult(response.data);
    
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-amber-600 p-4 min-h-screen">
            <h2 className="text-xl font-bold mb-4">Upload MRI Scan</h2>

            {/* File Input */}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-white p-2"
            />

            {/* Preview */}
            {preview && (
                <div className="mt-4">
                    <img
                        src={preview}
                        alt="preview"
                        width="300"
                        className="rounded-lg"
                    />
                </div>
            )}

            {/* Upload Button */}
            <div className="mt-4">
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    {loading ? "Uploading..." : "Upload & Analyze"}
                </button>
            </div>

            {/* Result */}
            {result && (
                <div className="mt-6 bg-white p-4 rounded">
                    <h3 className="text-lg font-semibold">Result</h3>

                    <p>
                        <strong>Tumor Type:</strong>{" "}
                        {result.tumorType || JSON.stringify(result)}
                    </p>

                    <p>
                        <strong>Confidence:</strong>{" "}
                        {result.confidence ?? "N/A"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Report;