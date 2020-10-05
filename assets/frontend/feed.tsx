import React from "react";

interface FeedProps {
  name: string;
}

const Feed: React.FC<FeedProps> = (props: FeedProps) => {
  const name = props.name;
  return ( <h1>Welcome Feed, {name} </h1> )
};

export default Feed;
