'use client'

import { SetStateAction, useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import Results from "./components/results";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleQueryChange = (newValue: SetStateAction<string>) => {
    setQuery(newValue);
  }

  const search = () => {
    setLoading(true);
    setResults([]);
    console.log("Query:", query);
    fetch("http://192.168.2.43:5000/query/" + query)
      .then(response => response.json())
      .then(json => setResults(json))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }

  const download = (url: string) => {
    setDownloading(true);
    fetch("http://192.168.2.43:5000/download?url=" + url)
      .catch(error => console.error(error))
  }

  useEffect(() => {
    console.log("results:", results);
  }, [results])

  return (
    <>
    <div>
      <h1>Download to Plex server</h1>
    </div>
    <div>
      <TextField
        label="Search for a movie or TV Show"
        variant="outlined"
        onChange={(e) => {
          handleQueryChange(e.target.value);
        } } />
      <Button
        variant="contained"
        onClick={() => {
          search();
        } }
      >
        Search
      </Button>
    </div>
    {results.length > 0 && 
      <div>
        <Results data={results} download={download}/>
      </div>
    }
    {loading === true && 
      <h1>LOADING</h1>
    }
    </>
  );
}
