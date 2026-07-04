// ============================================================================
// ParkPal — Modern SaaS Dashboard (Light Theme, JetBrains Mono)
// ============================================================================
// UI-only overhaul. All backend APIs, routes, and business logic are UNCHANGED.
// Features preserved: CRUD, Cloudinary upload, Leaflet map, geolocation.
// ============================================================================

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import MapView from "./components/ui/MapView";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function App() {
  // ============================================================
  // STATE — Identical to original, no changes to business logic
  // ============================================================

  const [floor, setFloor] = useState("");
  const [note, setNote] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [parkingList, setParkingList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [generatingNote, setGeneratingNote] = useState(false);

  // UI Feedback State (replaces browser alerts)
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 24.833,
    longitude: 92.778,
  });

  const mapRef = useRef(null);
  const fileInputRef = useRef(null);

  // ============================================================
  // TOAST — Clean UI feedback instead of browser alerts
  // ============================================================

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ============================================================
  // API CALLS — Exact same endpoints, no changes
  // ============================================================

  const fetchParking = async () => {
    try {
      const response = await axios.get("http://localhost:5000/parking");
      setParkingList(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchParking();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation not supported", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        showToast("Location captured!");
      },
      () => {
        showToast("Unable to fetch location", "error");
      },
    );
  };

  const uploadImage = async () => {
    if (!image) return imageUrl;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "parkpal_upload");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/f3k16qqy/image/upload",
        formData,
      );

      setUploading(false);
      setImageUrl(response.data.secure_url);
      return response.data.secure_url;
    } catch (err) {
      console.log(err);
      setUploading(false);
      showToast("Image upload failed", "error");
      return "";
    }
  };

  const deleteParking = async (id) => {
    if (!window.confirm("Delete this parking?")) return;

    try {
      await axios.delete(`http://localhost:5000/parking/${id}`);
      showToast("Parking deleted");
      fetchParking();
    } catch (err) {
      console.log(err);
    }
  };

  const editParking = (parking) => {
    setFloor(parking.floor);
    setNote(parking.note);
    setLatitude(parking.latitude);
    setLongitude(parking.longitude);

    if (parking.imageUrl) {
      setImageUrl(parking.imageUrl);
    }

    setEditingId(parking._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const generateParkingNote = async () => {
    try {
      if (!image && !imageUrl) {
        alert("Please choose an image first.");

        return;
      }

      setGeneratingNote(true);

      let uploadedImageUrl = imageUrl;

      // Upload image first if user selected a new one
      if (image) {
        uploadedImageUrl = await uploadImage();
      }

      const response = await axios.post(
        "http://localhost:5000/ai/generate-note",
        {
          imageUrl: uploadedImageUrl,
        },
      );

      setNote(response.data.note);

      setImageUrl(uploadedImageUrl);

      setGeneratingNote(false);
    } catch (error) {
      console.log(error);

      setGeneratingNote(false);

      alert("Failed to generate AI note.");
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      let uploadedImageUrl = imageUrl;

      if (image) {
        uploadedImageUrl = await uploadImage();
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/parking/${editingId}`, {
          floor,
          note,
          latitude,
          longitude,
          imageUrl: uploadedImageUrl,
        });
        showToast("Parking updated successfully!");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/parking", {
          floor,
          note,
          latitude,
          longitude,
          imageUrl: uploadedImageUrl,
        });
        showToast("Parking saved successfully!");
      }

      setFloor("");
      setNote("");
      setLatitude("");
      setLongitude("");
      setImage(null);
      setImageUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      fetchParking();

      setSelectedLocation({
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
    } catch (err) {
      console.log(err);
      showToast("Failed to save parking", "error");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFloor("");
    setNote("");
    setLatitude("");
    setLongitude("");
    setImage(null);
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ========================================== */}
      {/* TOAST NOTIFICATION                         */}
      {/* ========================================== */}

      {toast && (
        <div
          className={`
          fixed top-5 right-5 z-50 px-4 py-2.5 rounded-lg text-sm font-medium
          shadow-lg border transition-all duration-300 animate-[fadeInDown_0.3s_ease-out]
          ${
            toast.type === "error"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }
        `}
        >
          {toast.type === "error" ? "✕" : "✓"} {toast.message}
        </div>
      )}

      {/* ========================================== */}
      {/* HERO SECTION — Clean, no gradient          */}
      {/* ========================================== */}

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            ParkPal
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Never forget where you parked.
          </p>
        </div>
      </header>

      {/* ========================================== */}
      {/* MAIN CONTENT — Two-Column Layout           */}
      {/* ========================================== */}

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ====================================== */}
          {/* LEFT COLUMN — Parking Form             */}
          {/* ====================================== */}

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm">
                ✏️
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  {editingId ? "Edit Parking" : "New Parking"}
                </h2>
                <p className="text-xs text-slate-400">
                  {editingId
                    ? "Update your parking details"
                    : "Save your current parking spot"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Floor */}
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 font-medium">
                  Floor / Level
                </label>
                <Input
                  placeholder="e.g. B2, Level 3, Ground"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="rounded-lg h-9 text-sm"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 font-medium">
                  Parking Note
                </label>
                <Textarea
                  placeholder="Near elevator, blue pillar, section A..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="rounded-lg min-h-[80px] text-sm resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 font-medium">
                  Parking Photo
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-slate-200 file:text-xs file:font-medium file:bg-slate-50 file:text-slate-600 hover:file:bg-slate-100 file:cursor-pointer file:transition-colors cursor-pointer"
                />

                {/* Upload indicator */}
                {uploading && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                    <div className="w-3 h-3 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    Uploading to Cloudinary...
                  </div>
                )}

                {/* Image preview */}
                {(imageUrl || image) && !uploading && (
                  <div className="mt-3">
                    <img
                      src={image ? URL.createObjectURL(image) : imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                )}
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">
                    Latitude
                  </label>
                  <Input
                    placeholder="24.833000"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="rounded-lg h-9 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">
                    Longitude
                  </label>
                  <Input
                    placeholder="92.778000"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="rounded-lg h-9 text-sm"
                  />
                </div>
              </div>

              {/* Buttons */}
              <button
                onClick={getCurrentLocation}
                className="w-full h-9 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                📍 Use Current Location
              </button>

              <button
                onClick={handleSubmit}
                disabled={uploading || saving}
                className="w-full h-10 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {uploading || saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {uploading ? "Uploading..." : "Saving..."}
                  </>
                ) : editingId ? (
                  "💾 Update Parking"
                ) : (
                  "🚗 Save Parking"
                )}
              </button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={generateParkingNote}
                disabled={generatingNote || uploading || saving}
              >
                {generatingNote ? " Generating..." : "✨ Generate AI Note"}
              </Button>

              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="w-full h-8 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </section>

          {/* ====================================== */}
          {/* RIGHT COLUMN — Live Map                */}
          {/* ====================================== */}

          <section
            ref={mapRef}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm">
                🗺️
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Live Map
                </h2>
                <p className="text-xs text-slate-400">
                  View your parking location in real time
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <MapView
                latitude={selectedLocation.latitude}
                longitude={selectedLocation.longitude}
              />
            </div>

            {/* Coordinates display */}
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {selectedLocation.latitude.toFixed(4)}°N
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {selectedLocation.longitude.toFixed(4)}°E
              </span>
            </div>
          </section>
        </div>

        {/* ========================================== */}
        {/* SAVED PARKING RECORDS                      */}
        {/* ========================================== */}

        <section className="mt-10">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm">
              📋
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Saved Parking
              </h2>
              <p className="text-xs text-slate-400">
                {parkingList.length} record{parkingList.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Empty state */}
          {parkingList.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <span className="text-3xl block mb-3">🅿️</span>
              <p className="text-sm font-medium text-slate-500">
                No parking records yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Save your first parking spot above
              </p>
            </div>
          )}

          {/* Parking card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {parkingList.map((parking) => (
              <div
                key={parking._id}
                className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5"
              >
                {/* Parking Image */}
                {parking.imageUrl && (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={parking.imageUrl}
                      alt="Parking"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  {/* Floor + Note */}
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium mb-2">
                      📍 Floor {parking.floor}
                    </span>

                    {parking.note && (
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {parking.note}
                      </p>
                    )}
                  </div>

                  {/* Coordinates */}
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <span>{Number(parking.latitude).toFixed(4)}°N</span>
                    <span>•</span>
                    <span>{Number(parking.longitude).toFixed(4)}°E</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    {/* View on Map */}
                    <button
                      onClick={() => {
                        console.log("Clicked");
                        console.log(parking.latitude);
                        console.log(parking.longitude);
                        setSelectedLocation({
                          latitude: Number(parking.latitude),
                          longitude: Number(parking.longitude),
                        });
                        mapRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }}
                      className="flex-1 h-8 rounded-md text-xs font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 border border-slate-200 transition-colors duration-150 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      🗺️ Map
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => editParking(parking)}
                      className="flex-1 h-8 rounded-md text-xs font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 border border-slate-200 transition-colors duration-150 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      ✏️ Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteParking(parking._id)}
                      className="h-8 w-8 rounded-md text-xs text-red-400 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors duration-150 flex items-center justify-center cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ========================================== */}
      {/* FOOTER                                     */}
      {/* ========================================== */}

      <footer className="border-t border-slate-200 mt-16 py-6 text-center bg-white">
        <p className="text-xs text-slate-300">
          Built with React, Leaflet & Cloudinary — ParkPal ©{" "}
          {new Date().getFullYear()}
        </p>
      </footer>

      {/* Toast animation keyframes */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
