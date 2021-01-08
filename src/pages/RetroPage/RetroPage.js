// React
import React, { useState, useEffect } from "react";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";

// Icons
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

// Retro Types Icons
import Looks4Icon from "@material-ui/icons/Looks4";
import StarRateIcon from "@material-ui/icons/StarRate";
import StarIcon from "@material-ui/icons/Star";
import TrafficIcon from "@material-ui/icons/Traffic";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import AssignmentIcon from "@material-ui/icons/Assignment";

// Customer Components
import ProductTitle from "../../components/ProductTitle/ProductTitle";
import TimerPartyParrotHorizontal from "../../components/TimerPartyParrot/TimerPartyParrotHorizontal";
import RetroColumn from "./03_Retro/RetroColumn/RetroColumn";

// nanoid (Used for short unique IDs for Socket Rooms)
import { nanoid } from "nanoid";

// socket.io
import io from "socket.io-client";

// CSS
import "./RetroPage.css";

function Retro() {
  const [meeting, setMeeting] = useState({
    type: "retro",
    subtype: undefined,
    columns: [],
    cards: [],
    meetingStarted: false,
    meetingStartTime: null,
    meetingEndTime: null,
  });
  const [meetingParticipants, setMeetingParticipants] = useState([]);
  const [socket, setSocket] = useState(false);

  const retroColumns = {
    fourLs: ["Liked", "Learned", "Lacked", "Longed For"],
    starfishSmall: ["Keep", "More Of", "Less Of / Stop"],
    starfishLarge: [
      "Keep Doing",
      "More Of",
      "Start Doing",
      "Stop Doing",
      "Less Of",
    ],
    startStopContinue: ["Start", "Stop", "Continue"],
    madSadGlad: ["Mad", "Sad", "Glad"],
    oneWord: ["Your Thoughts In One Word"],
    KALM: ["Keep", "Add", "More", "Less"],
  };

  function setRetroType(type = "fourLs") {
    // Set the meeting columns, default to 4Ls
    setMeeting({ ...meeting, subtype: type, columns: retroColumns[type] });
  }

  function addCard(colIndex) {
    const newState = { ...meeting };
    newState.cards.push({
      id: nanoid(),
      columnIndex: colIndex,
      content: "",
      thumbsUp: 0,
      thumbsDown: 0,
    });
    setMeeting(newState);
  }

  function deleteCard(id) {
    setMeeting({
      ...meeting,
      cards: meeting.cards.filter((el) => (el.id !== id ? true : false)),
    });
  }

  function updateCardText({ id, content }) {
    const index = meeting.cards.findIndex((card) => card.id === id);
    const newCard = meeting.cards[index];
    // Move the card
    newCard.content = content;
    const newCards = [...meeting.cards];
    newCards[index] = newCard;
    // Set state
    setMeeting({
      ...meeting,
      cards: newCards,
    });
  }

  function updateCardVotes({ id, thumb }) {
    // Find Card
    const index = meeting.cards.findIndex((card) => card.id === id);
    const newCard = meeting.cards[index];
    // Move the card
    newCard[thumb] += 1;
    const newCards = [...meeting.cards];
    newCards[index] = newCard;
    // Set state
    setMeeting({
      ...meeting,
      cards: newCards,
    });
  }

  function moveCard(id, direction) {
    // Find the card
    const index = meeting.cards.findIndex((card) => card.id === id);
    const newCard = meeting.cards[index];
    // Move the card
    switch (direction) {
      case "left":
        newCard.columnIndex -= 1;
        break;
      case "right":
        newCard.columnIndex += 1;
        break;
      default:
        break;
    }
    const newCards = [...meeting.cards];
    newCards[index] = newCard;
    setMeeting({
      ...meeting,
      cards: newCards,
    });
  }

  function sendMeetingToSocket() {
    fetch("http://localhost:8080/sockets/", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      connection: "keep-alive",
      body: JSON.stringify({ meeting }),
    });
  }

  // FIXME: Websocket connection, much replace with production back end URL
  useEffect(() => {
    if (!socket) {
      const connection = io.connect("localhost:8080/", {
        query: {
          // FIXME: Get unique id from state (for non-facilitators)
          roomID: `Retro_Room_${nanoid()}`,
          username: `Stefan_Socket_${nanoid()}`,
        },
      });
      setSocket(connection);
    }

    if (socket) {
      socket.on("participants", (participant) =>
        setMeetingParticipants([...meetingParticipants, participant])
      );

      socket.on("meeting", (newMeeting) => {
        if ({ ...meeting } != { ...newMeeting }) {
          setMeeting(newMeeting);
        }
      });
    }

    // sendMeetingToSocket();
  }, [meetingParticipants, socket]);

  // FIXME: Websocket connection, much replace with production back end URL
  useEffect(() => {
    sendMeetingToSocket();
  }, [meeting, sendMeetingToSocket]);

  return (
    <div className="Retro">
      <ProductTitle title="Retrospective" />
      <p>Pick your retro type:</p>
      <div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Looks4Icon />}
          onClick={() => setRetroType("fourLs")}
        >
          Four Ls (4Ls)
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<StarRateIcon />}
          onClick={() => setRetroType("starfishSmall")}
        >
          Starfish (Small)
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<StarIcon />}
          onClick={() => setRetroType("starfishLarge")}
        >
          Starfish (Large)
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<TrafficIcon />}
          onClick={() => setRetroType("startStopContinue")}
        >
          Start, Stop, Continue
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<EmojiEmotionsIcon />}
          onClick={() => setRetroType("madSadGlad")}
        >
          Mad, Sad, Glad
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ChatBubbleIcon />}
          onClick={() => setRetroType("oneWord")}
        >
          One Word Retro
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AssignmentIcon />}
          onClick={() => setRetroType("KALM")}
        >
          KALM Retro
        </Button>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper className="participantsTracker" elevation={2}>
            <h3>Connected participants</h3>
            <List dense={false}>
              {meetingParticipants.map((el) => (
                <ListItem>
                  <ListItemText primary={el.name} />
                  <ListItemSecondaryAction>
                    {el.isConnected ? (
                      <IconButton edge="end" aria-label="completed">
                        <CheckCircleIcon color="primary" />
                      </IconButton>
                    ) : null}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <TimerPartyParrotHorizontal
            props={{
              totalTime: 600,
              timeLeft: 600,
            }}
          />
        </Grid>
      </Grid>

      <div>
        <Grid
          className="retroBoardContainer"
          container
          spacing={2}
          wrap="nowrap"
        >
          {meeting.columns.map((columnTitle, index) => (
            <RetroColumn
              props={{
                meeting,
                setMeeting,
                columnTitle,
                index,
                addCard,
                updateCardText,
                updateCardVotes,
                deleteCard,
                moveCard,
                cards: meeting.cards.filter((card) =>
                  card.columnIndex === index ? true : false
                ),
              }}
            ></RetroColumn>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export default Retro;
