import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppContextConsumer } from "./layout";

interface LinkInfo {
  url: string;
  name: string;
  image?: string;
}


interface PersonalInfo {
  here: LinkInfo[];
  elsewhere: LinkInfo[];
}


const Home: React.FC<{}> = () => {

  const [data, setData] = useState<PersonalInfo>({ here: [], elsewhere: [] });

  const loadData = async () => {
    axios.get("/api/data/personal")
    .then(response => setData(response.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    // requires function which receives value as child
    <AppContextConsumer>
      {appContext =>
       (data.here !== undefined && data.here.length > 0) && (
         <>
           <p>{JSON.stringify(data)}</p>
         </>
      )}
    </AppContextConsumer>
  )
}

export default Home;
