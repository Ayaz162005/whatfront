import React, { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import MicNoneIcon from "@mui/icons-material/MicNone";

import { Theme } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PauseIcon from "@mui/icons-material/Pause";
import SendIcon from "@mui/icons-material/Send";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { useCreateMessage } from "../graphqlActions/CreateMessage";
import { useSearchParams } from "react-router-dom";
const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    height: "28px",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "transparent",
    color: "white",

    border: "none",
    cursor: "pointer",
    outline: "none",
    padding: "5px",
  },
  recordingPart: {
    backgroundColor: "black",
    padding: "5px",
    width: "140px",
    borderRadius: "20px",
    color: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 10px",
    "& div": {
      padding: "0",
      margin: "0",
    },
  },
}));
const VoiceRecorder = ({ recording, setRecording }) => {
  const classes = useStyles();

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [waveSurfer, setWaveSurfer] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const wavesurferRef = useRef(null);
  const waveRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const ChunksRef = useRef([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [continuousChunks, setContinuousChunks] = useState([]);
  const [a, setA] = useState(0);
  useEffect(() => {
    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: wavesurferRef.current,
      waveColor: "violet",
      progressColor: "purple",
      barWidth: 2,
      height: 20,
      responsive: true,
      hideScrollbar: true,
      cursorWidth: 1,
      cursorColor: "white",
    });

    waveRef.current = wavesurfer;
    setWaveSurfer(wavesurfer);

    return () => {
      if (waveSurfer) {
        waveSurfer.stop(); // Stop WaveSurfer playback
        waveSurfer.destroy(); // Destroy the WaveSurfer instance
      }
    };
  }, []);

  useEffect(() => {
    let timer;
    if (recording && !isPaused) {
      setStartTime(Date.now());
      timer = setInterval(() => {
        const currentTime = Date.now();
        setElapsedTime(Math.floor((currentTime - startTime) / 1000));
      }, 1000);
    } else {
      setTotalTime((prev) => prev + elapsedTime);
      setElapsedTime(0);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [recording, isPaused, startTime]);

  useEffect(() => {
    if (waveSurfer) {
      startRecording();
    }
  }, [waveSurfer]);
  useEffect(() => {
    if (waveSurfer) {
      waveSurfer.on("finish", () => {
        setIsPlaying(false); // Reset the playing state
        waveSurfer.stop(); // Stop playback
        waveSurfer.seekTo(0); // Seek to the beginning
      });
    }
  }, [waveSurfer]);
  useEffect(() => {
    if (waveSurfer) {
      waveSurfer.on("audioprocess", () => {
        setCurrentTime(Math.floor(waveSurfer.getCurrentTime()));
      });
    }
  }, [waveSurfer]);
  //   useEffect(() => {
  //     startRecording();
  //   }, []);
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        const chunks = []; // Array to store recorded data chunks

        recorder.addEventListener("dataavailable", (event) => {
          chunks.push(event.data); // Store each data chunk

          setAudioChunks(chunks); // Update audioChunks state with the new chunks
          setContinuousChunks((prevChunks) => [...prevChunks, ...chunks]);
          console.log("addeed");
        });

        recorder.addEventListener("stop", () => {
          handleSaveRecording([...continuousChunks, ...chunks]); // Save recording when stopped
          return chunks;
        });
        recorder.addEventListener("pause", (event) => {
          handleSaveRecording(chunks);
        });

        recorder.start();

        setRecording(true);
        setMediaRecorder(recorder);
        mediaRecorderRef.current = recorder;

        // setTimeout(() => {
        //   console.log("recorder stopped timeout");
        //   console.log(recorder);
        //   recorder.stop();
        // }, 5000);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  //   const stopRecording = () => {
  //     if (mediaRecorder) {
  //       mediaRecorder.stop();
  //       setRecording(false);
  //     }
  //   };
  const togglePlayback = () => {
    console.log(waveSurfer);
    if (waveSurfer && !isPlaying) {
      waveSurfer.play();
      setIsPlaying(true);
    } else if (waveSurfer && isPlaying) {
      waveSurfer.pause();
      setIsPlaying(false);
    }
  };

  const handleSaveRecording = (chunks) => {
    ChunksRef.current = chunks;
    console.log(chunks, "jfffffffffffffffpd");
    const audioBlob = new Blob(chunks, { type: "audio/wav" });
    console.log(audioBlob, "jfffffffffffffffpd");
    const audioUrl = URL.createObjectURL(audioBlob);

    waveRef.current.load(audioUrl);

    // waveSurfer && waveSurfer.play();
  };
  useEffect(() => {
    console.log(
      waveRef.current,
      "waveRef.currentsdtolpkkkkkkkkkkkkkkkkkkkkkkkkkkk"
    );
  }, [waveRef.current]);

  const handlePauseRecording = () => {
    mediaRecorder.stop();
    setIsPaused(true);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [createMessage] = useCreateMessage();
  async function sendAudioFile() {
    mediaRecorder.stop();

    // mediaRecorderRef.current.stop();
    setTimeout(async () => {
      console.log(ChunksRef.current);
      try {
        console.log(ChunksRef.current, "curren");
        console.log(continuousChunks);
        const audioBlob = new Blob(ChunksRef.current, { type: "audio/wav" });

        console.log(audioBlob);
        const formData = new FormData();
        formData.append("File", audioBlob, "voice.wav");
        const res = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          // Request succeeded
          console.log("Voice file uploaded successfully!");
          console.log(res);
          const data = await res.text();
          console.log(data);
          const res2 = await createMessage({
            variables: {
              createMessageInput: {
                content: data,
                chat: searchParams.get("chatId"),
                isVoice: true,
              },
            },
          });
          console.log(res2);
          setRecording(false);
          setIsPlaying(false);
          setAudioChunks([]);
          setContinuousChunks([]);
          setElapsedTime(0);
          setTotalTime(0);
          setMediaRecorder(null);
        } else {
          // Request failed
          console.error(
            "Failed to upload voice file:",
            res.status,
            res.statusText
          );
        }
      } catch (e) {
        console.log(e);
      }
    }, 500);
  }
  const handleResumeRecording = () => {
    startRecording();
    setIsPaused(false);
  };

  const handleDeleteRecording = () => {
    setAudioChunks([]); // Clear recorded audio chunks
    setRecording(false);
    console.log(mediaRecorder);
    if (mediaRecorder) {
      //   mediaRecorder.stop(); // Stop media recorder
    }

    setElapsedTime(0); // Reset elapsed time
    setMediaRecorder(null); // Reset mediaRecorder state
  };
  return (
    <div className={classes.root}>
      {recording && (
        <button
          className={classes.deleteButton}
          onClick={handleDeleteRecording}
        >
          <DeleteIcon style={{ color: "white" }} />
        </button>
      )}

      {isPaused && !isPlaying && (
        <PlayArrowIcon
          style={{ color: "white", cursor: "pointer" }}
          onClick={togglePlayback}
        />
      )}
      {isPaused && isPlaying && (
        <StopIcon
          style={{ color: "white", cursor: "pointer" }}
          onClick={togglePlayback}
        />
      )}
      <div
        ref={wavesurferRef}
        style={{
          display: `${!isPaused ? "none" : "block"}`,
          width: "100px",
        }}
      />
      {isPaused && (
        <div>
          {currentTime}:{totalTime}
        </div>
      )}

      {recording && !isPaused && (
        <div className={classes.recordingPart}>
          <FiberManualRecordIcon
            style={{
              fontSize: "18px",
              margin: "2px",
            }}
            className="recordingAnimation"
          />

          <div>recording {elapsedTime + totalTime}s</div>
        </div>
      )}

      {recording && !isPaused && (
        <button className={classes.deleteButton} onClick={handlePauseRecording}>
          <PauseIcon style={{ color: "white" }} />
        </button>
      )}
      {recording && isPaused && (
        <button
          className={classes.deleteButton}
          onClick={handleResumeRecording}
        >
          <MicNoneIcon style={{ color: "red" }} />
        </button>
      )}

      {!recording && (
        <button
          onClick={startRecording}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            outline: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <MicNoneIcon style={{ color: "white" }} />
        </button>
      )}
      {recording && (
        <button className={classes.deleteButton}>
          <SendIcon style={{ color: "white" }} onClick={sendAudioFile} />
        </button>
      )}
    </div>
  );
};

export default VoiceRecorder;
