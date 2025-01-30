import { useEffect, useState } from "react";
import userModules from "../../modules/user.ts";

interface Props {
  user: string;
}

const UserTravels = ({ user }: Props) => {
  const [travels, setTravels] = useState<any[]>([]); // Uppdatera typen baserat på API-svaret
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const travelsData = await userModules.getTravels(user);
        setTravels(travelsData);
      } catch (err) {
        setError("Failed to fetch travels");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTravels();
  }, [user]);

  if (loading) {
    return <p>Loading travels...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>User Travels</h2>
      {travels.length === 0 ? (
        <p>No travels found for this user.</p>
      ) : (
        <ul>
          {travels.map((travel, index) => (
            <li key={index}>{JSON.stringify(travel)}</li> // Anpassa detta efter datan
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserTravels;
