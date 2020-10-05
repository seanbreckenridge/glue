import React from "react";

interface CubingProps {
  name: string;
}

const Cubing: React.FC<CubingProps> = (props: CubingProps) => {
  const name = props.name;
  return ( <h1>Welcome Cubing, {name} </h1> )
};

export default Cubing;
