import React, { Component, useState, useEffect } from "react";
import axios from "axios";

interface LinkInfo {
  url: string;
  name: string;
  image?: string;
}


interface HomeProps {
}

interface PersonalInfo {
  here: LinkInfo[];
  elsewhere: LinkInfo[];
}

interface HomeState {
  data?: PersonalInfo;
  loading: boolean;
}


class Home extends Component<HomeProps, HomeState> {

  constructor(props: HomeProps) {
    super(props);
    this.state = {
      loading: true,
    }
  }

  loadData = async () => {
    axios.get("/api/data/personal")
    .then(response => {
      this.setState({
        data: response.data,
        loading: false,
      });
    });
  };

  componentDidMount() {
    this.loadData();
  }

  render() {
    if (this.state.loading) {
      return <h1>loading...</h1>
    } else {
      return <h1>State is {this.state.data!.here.length + this.state.data!.elsewhere.length}</h1>
    }
  }

}

export default Home;
