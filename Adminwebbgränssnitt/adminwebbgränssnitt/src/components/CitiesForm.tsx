import citiesModules from "../../modules/citises.ts";
import React, { useEffect, useState } from "react";
interface City {
  city_id?: number;
  name: string;
  country: string;
}

const CitiesForm: React.FC = () => {
  const [cityList, setCityList] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const result = await citiesModules.getcities();
        if (result.status === "success") {
          setCityList(result.cities);
        } else {
          setError("Failed to fetch cities from API");
        }
      } catch (err) {
        setError("An error occurred while fetching cities");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return <p>Loading cities...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>List of Cities</h1>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Country</th>
          </tr>
        </thead>
        <tbody>
          {cityList.map((city) => (
            <tr key={city.city_id}>
              <th scope="row">{city.city_id}</th>
              <td>{city.name}</td>
              <td>{city.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CitiesForm;
