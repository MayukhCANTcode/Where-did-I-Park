import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function App() {
  // ============================
  // React State
  // ============================

  const [floor, setFloor] = useState("");
  const [note, setNote] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [parkingList, setParkingList] = useState([]);

  // ============================
  // Fetch Parking Records
  // ============================

  const fetchParking = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/parking"
      );

      setParkingList(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ============================
  // Runs when page loads
  // ============================

  useEffect(() => {
    fetchParking();
  }, []);

  // ============================
  // Save Parking
  // ============================

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/parking",
        {
          floor,
          note,
          latitude,
          longitude,
        }
      );

      alert(response.data.message);

      setFloor("");
      setNote("");
      setLatitude("");
      setLongitude("");

      // Refresh list
      fetchParking();

    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
      }

      alert("Failed to save parking.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-8">

      <Card className="w-full max-w-xl shadow-xl">

        <CardHeader>

          <CardTitle className="text-4xl text-center">
            🚗 ParkPal
          </CardTitle>

          <p className="text-center text-gray-500">
            Never forget where you parked.
          </p>

        </CardHeader>

        <CardContent>

          <div className="space-y-5">

            <Input
              placeholder="Floor (Example: B2)"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />

            <Textarea
              placeholder="Parking Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <Input
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />

            <Input
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />

            <Button
              className="w-full"
              onClick={handleSubmit}
            >
              Save Parking
            </Button>

          </div>

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
              Saved Parking
            </h2>

            <div className="space-y-4">

              {parkingList.length === 0 ? (

                <Card>

                  <CardContent className="pt-6">

                    <h3 className="font-bold">
                      No parking records yet.
                    </h3>

                  </CardContent>

                </Card>

              ) : (

                parkingList.map((parking) => (

                  <Card key={parking._id}>

                    <CardContent className="pt-6 space-y-2">

                      <h3 className="font-bold text-lg">
                        📍 Floor : {parking.floor}
                      </h3>

                      <p>
                        📝 {parking.note}
                      </p>

                      <p>
                        🌍 Latitude : {parking.latitude}
                      </p>

                      <p>
                        🌍 Longitude : {parking.longitude}
                      </p>

                    </CardContent>

                  </Card>

                ))

              )}

            </div>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}

export default App;