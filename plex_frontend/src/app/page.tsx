'use client'

import { SetStateAction, useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import Results from "./components/results";
import Head from 'next/head';

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleQueryChange = (newValue: SetStateAction<string>) => {
    setQuery(newValue);
  }

  const search = () => {
    setLoading(true);
    setResults([]);
    console.log("Query:", query);
    fetch("https://proper-trusty-man.ngrok-free.app/query/" + query)
      .then(response => response.json())
      .then(json => setResults(json))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }

  const download = (url: string) => {
    setDownloading(true);
    setResults([]);
    fetch("https://proper-trusty-man.ngrok-free.app/download?url=" + url)
      .catch(error => console.error(error))
  }

  useEffect(() => {
    console.log("results:", results);
  }, [results])

  return (
    <div className="whole-thing">
      {/* Ensure the Head component is at the top level */}
      <Head>
        <title>Download to Plex Server</title>
      </Head>
      
      <div>
        <h1>Download to Plex server</h1>
      </div>
      <div>
        <TextField
          label="Search for a movie or TV Show"
          variant="outlined"
          onChange={(e) => {
            handleQueryChange(e.target.value);
          } }
        />
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
      {downloading === true && 
        <>
          <h1>Downloading probably</h1>
          <h1>Check Plex in 10ish mins</h1>
          <h1>Do not try and download again until the original is done please</h1>
        </>
      }
    </div>
  );
}
