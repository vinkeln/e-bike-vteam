import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import userModules from "../../modules/user.ts";

const UserTravelsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [travels, setTravels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const result = await userModules.getTravels(userId!); // Använd userId från params
        if (result === "empty") {
          setTravels([]); // Om result är "empty", sätt en tom array
        } else {
          setTravels(result);
        }
      } catch (err) {
        setError("Failed to fetch travels");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTravels();
  }, [userId]);

  if (loading) {
    return <p>Loading travels...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Travels for User {userId}</h1>
      {travels.length === 0 ? ( // Kontrollera om travels är tom
        <p>This user has no travels.</p> // Visa meddelande om tom lista
      ) : (
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th scope="col">Travel ID</th>
              <th scope="col">Scooter ID</th>
              <th scope="col">Start location id</th>
              <th scope="col">End location id</th>
              <th scope="col">Start time</th>
              <th scope="col">End time</th>
              <th scope="col">Cost</th>
            </tr>
          </thead>
          <tbody>
            {travels.map((travel, index) => (
              <tr key={index}>
                <td>{travel.ride_id}</td>
                <td>{travel.scooter_id}</td>
                <td>{travel.start_location_id}</td>
                <td>{travel.end_location_id}</td>
                <td>{travel.start_time}</td>
                <td>{travel.end_time}</td>
                <td>{travel.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTravelsPage;
