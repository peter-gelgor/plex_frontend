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
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);

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

  const getProgress = () => {
    return fetch("https://proper-trusty-man.ngrok-free.app/progress")
      .then(response => response.json())
      .then(data => {
        const percentCompleted = data.percent_completed;
        if (percentCompleted === -1) {
          // Assume -1 indicates that the download is done or not started
          return { percentCompleted, isDone: true };
        }
        return { percentCompleted, isDone: false };
      })
      .catch(error => {
        console.error("Failed to get progress:", error);
        return { percentCompleted: -1, isDone: true }; // Assume error means download is done or not started
      });
  }

  const terminate = () => {
    return fetch("https://proper-trusty-man.ngrok-free.app/terminate")
      .then(response => response.json())
      .then( data => {
        const terminated = data.terminated;
        if (terminated === true) {
          return { success: true, clientIssue: false };
        }
        else {
          return { success: false, clientIssue: false };
        }
      })
      .catch(() => {
        return { success: false, clientIssue: true };
      });
  }



  useEffect(() => {
    getProgress().then(({ percentCompleted }) => {
      if (percentCompleted !== -1) {
        setShowDownloadMessage(true);
      }
    });
  }, [])

  if (showDownloadMessage) {
    return (
      <div className="whole-thing">
        {/* Ensure the Head component is at the top level */}
        <Head>
          <title>Download to Plex Server</title>
        </Head>

        <h1 style={{ color: 'red' }}>Someone else is currently downloading something. Please wait and try again later.</h1>
        <Button onClick={() => {
          getProgress().then(({ percentCompleted, isDone}) => {
            if (isDone) {
              alert("Download either completed or not started yet");
            } else {
              alert(percentCompleted + "%");
            }
            
          })
        }}>
          Check Progress
        </Button>
        <Button onClick={() => {
          terminate().then(({ success, clientIssue}) => {
            if (success) {
              alert("Successfully terminated");
            } else if (!clientIssue) {
              alert("Unsuccessful termination - server issue");
            } else {
              alert("Unsuccessful termination - client issue");
            }
          })
        }}>
          Terminate current download
        </Button>
      </div>
    );
  }

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
        <h1>Downloading...</h1>
        <Button onClick={() => {
          getProgress().then(({ percentCompleted, isDone}) => {
            if (isDone) {
              alert("Download either completed or not started yet");
            } else {
              alert(percentCompleted + "%");
            }
            
          })
        }}>
          Check Progress
        </Button>

        <Button onClick={() => {
          terminate().then(({ success, clientIssue}) => {
            if (success) {
              alert("Successfully terminated");
            } else if (!clientIssue) {
              alert("Unsuccessful termination - server issue");
            } else {
              alert("Unsuccessful termination - client issue");
            }
          })
        }}>
          Terminate current download
        </Button>
      </>
      }
    </div>
  );
}
