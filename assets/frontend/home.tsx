import React from "react";

interface HomeProps {
  name: string;
}

const Home: React.FC<HomeProps> = (props: HomeProps) => {
  const name = props.name;
  return ( <h1>Welcome Home, {name} </h1> )
};

export default Home;
