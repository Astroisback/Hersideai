"use client";
import { useState } from "react";
import { User, Upload, X } from "lucide-react";

export default function ProfilePictureUpload({ value, onChange, size = "large" }) {
    const [preview, setPreview] = useState(value || null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }

        setUploading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            setPreview(base64);
            onChange(base64);
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
    };

    const sizeClasses = {
        small: "w-16 h-16",
        medium: "w-24 h-24",
        large: "w-32 h-32"
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-200`}>
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <User size={size === "large" ? 48 : size === "medium" ? 32 : 24} className="text-gray-400" />
                    </div>
                )}
            </div>

            <label className="cursor-pointer">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    <Upload size={16} />
                    {uploading ? "Uploading..." : preview ? "Change Picture" : "Upload Picture"}
                </div>
            </label>
        </div>
    );
}
