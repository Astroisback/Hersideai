"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Search, MapPin, Navigation, Loader } from "lucide-react";

const libraries = ["places"];

const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "0.75rem",
};

const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629, // Center of India
};

export default function AddressPicker({ value, onChange, label = "Select Location" }) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(value?.location || null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [searchValue, setSearchValue] = useState(value?.fullAddress || "");
    const [loading, setLoading] = useState(false);

    // Initialize marker from value
    useEffect(() => {
        if (value?.location) {
            setMarker(value.location);
        }
        if (value?.fullAddress) {
            setSearchValue(value.fullAddress);
        }
    }, [value]);

    const onMapLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onAutocompleteLoad = useCallback((autocomplete) => {
        setAutocomplete(autocomplete);
    }, []);

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();

            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const newMarker = { lat, lng };

                setMarker(newMarker);
                setSearchValue(place.formatted_address || "");

                if (map) {
                    map.panTo(newMarker);
                    map.setZoom(16);
                }

                // Extract address components
                const addressComponents = place.address_components || [];
                const addressData = {
                    location: newMarker,
                    fullAddress: place.formatted_address || "",
                    houseNumber: getAddressComponent(addressComponents, "street_number"),
                    street: getAddressComponent(addressComponents, "route"),
                    area: getAddressComponent(addressComponents, "sublocality_level_1") ||
                        getAddressComponent(addressComponents, "locality"),
                    city: getAddressComponent(addressComponents, "locality") ||
                        getAddressComponent(addressComponents, "administrative_area_level_2"),
                    state: getAddressComponent(addressComponents, "administrative_area_level_1"),
                    pincode: getAddressComponent(addressComponents, "postal_code"),
                    country: getAddressComponent(addressComponents, "country")
                };

                onChange(addressData);
            }
        }
    };

    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const newMarker = { lat, lng };

        setMarker(newMarker);
        reverseGeocode(lat, lng);
    };

    const handleMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const newMarker = { lat, lng };

        setMarker(newMarker);
        reverseGeocode(lat, lng);
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const geocoder = new window.google.maps.Geocoder();
            const response = await geocoder.geocode({ location: { lat, lng } });

            if (response.results[0]) {
                const place = response.results[0];
                setSearchValue(place.formatted_address);

                const addressComponents = place.address_components || [];
                const addressData = {
                    location: { lat, lng },
                    fullAddress: place.formatted_address,
                    houseNumber: getAddressComponent(addressComponents, "street_number"),
                    street: getAddressComponent(addressComponents, "route"),
                    area: getAddressComponent(addressComponents, "sublocality_level_1") ||
                        getAddressComponent(addressComponents, "locality"),
                    city: getAddressComponent(addressComponents, "locality") ||
                        getAddressComponent(addressComponents, "administrative_area_level_2"),
                    state: getAddressComponent(addressComponents, "administrative_area_level_1"),
                    pincode: getAddressComponent(addressComponents, "postal_code"),
                    country: getAddressComponent(addressComponents, "country")
                };

                onChange(addressData);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    };

    const handleCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const newMarker = { lat, lng };

                    setMarker(newMarker);
                    if (map) {
                        map.panTo(newMarker);
                        map.setZoom(16);
                    }

                    reverseGeocode(lat, lng);
                    setLoading(false);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Could not get your location. Please check permissions.");
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
            setLoading(false);
        }
    };

    const getAddressComponent = (components, type) => {
        const component = components.find(c => c.types.includes(type));
        return component ? component.long_name : "";
    };

    if (loadError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 font-medium">Error loading Google Maps</p>
                <p className="text-sm text-red-500 mt-1">{loadError.message}</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="h-[400px] w-full bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                <Loader className="animate-spin mb-2 text-pink-600" size={32} />
                <p className="text-gray-600">Loading Maps...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <button
                    type="button"
                    onClick={handleCurrentLocation}
                    disabled={loading}
                    className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 font-medium disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader size={14} className="animate-spin" />
                            Getting location...
                        </>
                    ) : (
                        <>
                            <Navigation size={14} />
                            Use Current Location
                        </>
                    )}
                </button>
            </div>

            {/* Search Box with Autocomplete */}
            <div className="relative">
                <Autocomplete
                    onLoad={onAutocompleteLoad}
                    onPlaceChanged={onPlaceChanged}
                    options={{
                        componentRestrictions: { country: "in" },
                        fields: ["address_components", "geometry", "formatted_address"],
                    }}
                >
                    <div className="relative">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search for area, street name..."
                            className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                </Autocomplete>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={marker || defaultCenter}
                    zoom={marker ? 15 : 5}
                    onLoad={onMapLoad}
                    onClick={handleMapClick}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {marker && (
                        <Marker
                            position={marker}
                            draggable={true}
                            onDragEnd={handleMarkerDragEnd}
                        />
                    )}
                </GoogleMap>
            </div>

            {/* Address Preview */}
            {value?.fullAddress && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm space-y-2">
                    <p className="font-medium text-gray-900">Selected Address:</p>
                    <p className="text-gray-600">{value.fullAddress}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <span className="text-xs text-gray-500 block">City</span>
                            <span className="text-gray-800">{value.city || "-"}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block">State</span>
                            <span className="text-gray-800">{value.state || "-"}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block">Pincode</span>
                            <span className="text-gray-800">{value.pincode || "-"}</span>
                        </div>
                        {value.location && (
                            <div>
                                <span className="text-xs text-gray-500 block">Coordinates</span>
                                <span className="text-gray-800 text-xs">
                                    {value.location.lat?.toFixed(6)}, {value.location.lng?.toFixed(6)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
