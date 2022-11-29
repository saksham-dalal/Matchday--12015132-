
import React, { useState, useEffect } from "react";
import axios from "axios";
import MatchesView from "../MatchesView";
import { BsSearch } from "react-icons/bs";
import "./HomePage.css";

const HomePage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [filtered, setFilterd] = useState(false);

  const filterData = fixtures.filter((data) => {
    if (inputVal === "") {
      return data;
    } else {
      return (
        data.team1[0].name.includes(inputVal) ||
        data.team2[0].name.includes(inputVal)
      );
    }
  });

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    for (let i = 0; i < 10; i++) {
      axios
        .get(
          `http://matchday.ai/referee/champ/fixture/dummy-matches?page=${i}`,
          { cancelToken: cancelToken.token }
        )
        .then((res) => {
          setFixtures((prev) => [...prev, ...res.data.fixtures]);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("req cancel");
          }
          else{
            console.log("req performed");
          }
        });
    }

    return () => {
      cancelToken.cancel();
    };
  }, []);

  return (
    <div>
      <div className="home-head">International Matches</div>
      <div className="search-box">
        <div
          className="search-btn"
          onClick={() => {
            setFilterd(true);
          }}
        >
          {" "}
          <BsSearch />
        </div>
        <input
          onChange={(e) => setInputVal(e.target.value)}
          type="text"
          className="searchBar"
          placeholder="Search for Matches and then click on search"
        />
      </div>
      <div>
        {filtered ? (
          <MatchesView matchData={filterData} />
        ) : (
          <MatchesView matchData={fixtures} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
