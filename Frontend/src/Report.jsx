import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://anshu370-brain-tumer-detection.hf.space/predict";

const confidence = (val) => `${(val * 100).toFixed(2)}%`;

const PredictionBadge = ({ label }) => {
    const isTumor = label?.toLowerCase() !== "notumer";
    return (
        <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                isTumor
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-green-100 text-green-700 border border-green-300"
            }`}
        >
            {isTumor ? label : "No Tumor"}
        </span>
    );
};

const Report = () => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const processFiles = (selectedFiles) => {
        const fileArr = Array.from(selectedFiles).filter((f) =>
            f.type.startsWith("image/")
        );
        if (fileArr.length === 0) return;
        setFiles(fileArr);
        setResult(null);
        setError(null);
        const urls = fileArr.map((f) => URL.createObjectURL(f));
        setPreviews(urls);
    };

    const handleFileChange = (e) => processFiles(e.target.files);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        processFiles(e.dataTransfer.files);
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setFiles(newFiles);
        setPreviews(newPreviews);
        if (newFiles.length === 0) setResult(null);
    };

    const handleAnalyze = async () => {
        if (files.length === 0) return;

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            files.forEach((f) => formData.append("files", f));

            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isTumor = result && result.final_prediction?.toLowerCase() !== "notumer";

    return (
        <div className="min-h-screen w-full bg-[#5a06f62a] overflow-x-hidden scroll-smooth">
            {/* Header */}

            <div className="max-w-7xl mx-auto">
                {!result ? (
                    // Upload View
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: Upload Panel */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Drop Zone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-3xl p-2 text-center cursor-pointer transition-all duration-300 ${
                                    dragOver
                                        ? "border-blue-600 bg-blue-50 shadow-md"
                                        : "border-blue-300 bg-white hover:border-blue-500 hover:bg-blue-50/50 shadow-sm"
                                }`}
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center shadow-md">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-lg">Drop MRI images here</p>
                                        <p className="text-sm text-blue-600 mt-2">or click to browse — multiple files supported</p>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Preview Grid */}
                            {previews.length > 0 && (
                                <div className="bg-white rounded-2xl p-2 border border-blue-100 shadow-sm">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Selected Slices ({previews.length})</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {previews.map((src, i) => (
                                            <div key={i} className="relative group rounded-xl overflow-hidden border border-blue-200 bg-white shadow-md hover:shadow-lg transition-shadow">
                                                <img
                                                    src={src}
                                                    alt={`MRI slice ${i + 1}`}
                                                    className="w-full h-40 object-cover"
                                                />
                                                <button
                                                    onClick={() => removeFile(i)}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                >
                                                    ×
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-transparent text-white text-xs font-semibold text-center py-2">
                                                    Slice {i + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-5 py-4 text-sm font-medium shadow-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Right: Info Card */}
                        <div className="bg-[#5a06f638] rounded-2xl border border-blue-100 p-6 shadow-md h-fit">
                           

                            {/* Analyze Button */}
                            <button
                                onClick={handleAnalyze}
                                disabled={files.length === 0 || loading}
                                className={`w-full mt-2 py-2 px-2 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-1 ${
                                    files.length === 0 || loading
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Analyze {files.length > 0 ? `(${files.length} image${files.length > 1 ? "s" : ""})` : "Images"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Results View
                    <div className="space-y-6 mt-17 w-full overflow-hidden">
                        {/* Final Verdict */}
                        <div
  className={`rounded-3xl p-6 border shadow-lg overflow-hidden ${isTumor
      ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
      : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
  }`}
>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">Final Diagnosis</p>
                                    <div className="flex items-center gap-4">
                                        <PredictionBadge label={result.final_prediction} />
                                        <div>
                                            <p className="text-3xl font-bold text-gray-800">
                                                {confidence(result.confidence)}
                                            </p>
                                            <p className="text-sm text-gray-600">Confidence Level</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isTumor ? "bg-red-100" : "bg-green-100"}`}>
                                    {isTumor ? (
                                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Per-Slice Results */}
                        {result.slice_results?.length > 0 && (
                            <div className="bg-[#5a06f638] rounded-3xl border border-blue-100 p-7 shadow-md">
                                <p className="text-lg font-bold text-white mb-5">Detailed Slice Analysis</p>
                                <div className="grid gap-3">
                                    {result.slice_results.map((s) => (
                                        <div key={s.slice} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-white border border-blue-100 hover:border-blue-200 transition-all">
                                            <span className="text-sm font-semibold text-blue-900">Slice {s.slice + 1}</span>
                                            <div className="flex items-center gap-4">
                                                <PredictionBadge label={s.prediction} />
                                                <span className="text-sm font-bold text-gray-800 w-20 text-right">
                                                    {confidence(s.confidence)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Heatmaps */}
                        {result.heatmaps?.length > 0 && (
                            <div className="bg-[#5a06f638] rounded-3xl border border-blue-100 p-7 shadow-md">
                                <p className="text-lg font-bold text-white mb-2">Activation Heatmaps</p>
                                <p className="text-sm text-white mb-5">AI-highlighted regions of interest indicating areas analyzed for tumor detection</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {result.heatmaps.map((src, i) => (
        <div
            key={i}
            className="rounded-2xl overflow-hidden border border-blue-100 shadow-md bg-white"
        >
            <img
                src={src}
                alt={`Heatmap slice ${i + 1}`}
                className="w-full h-64 object-cover"
                onError={(e) => {
                    e.target.style.display = "none";
                }}
            />

            <p className="text-center text-sm font-semibold text-blue-900 py-3 bg-blue-50">
                Slice {i + 1} Heatmap
            </p>
        </div>
    ))}
</div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate("/User")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setFiles([]);
                                    setPreviews([]);
                                    setError(null);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                            >
                                Analyze New Images
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;
