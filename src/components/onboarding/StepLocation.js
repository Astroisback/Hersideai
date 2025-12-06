"use client";
import dynamic from "next/dynamic";

const AddressPicker = dynamic(() => import("@/components/shared/AddressPicker"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 rounded-xl flex items-center justify-center">Loading Map...</div>
});

export default function StepLocation({ data, updateData }) {
    const handleAddressChange = (addressData) => {
        updateData({
            location: addressData.location,
            address: addressData.fullAddress,
            city: addressData.city,
            state: addressData.state,
            pincode: addressData.pincode,
            // Store structured address if needed
            structuredAddress: addressData
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Where are you located?</h2>
                <p className="text-gray-500">Pin your business location to help customers find you.</p>
            </div>

            <AddressPicker
                value={{
                    location: data.location,
                    fullAddress: data.address,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode
                }}
                onChange={handleAddressChange}
                label="Search for your area or pin on map"
            />
        </div>
    );
}
