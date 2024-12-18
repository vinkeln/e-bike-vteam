import auth from "../../modules/auths.ts";
import { useState, useEffect } from "react";

function Home() {
  const [tokenChecker, setTokenChecker] = useState(true);

  // Använd useEffect för att hantera state-uppdateringen
  useEffect(() => {
    if (!auth.token) {
      setTokenChecker(false);
    }
  }, []); // Tom beroendelista gör att detta bara körs vid första renderingen

  return (
    <>
      {tokenChecker && <h1>hello</h1>}
      <h1>Welcome to home page</h1>
    </>
  );
}

export default Home;
