// React
import React, { useState, useEffect } from "react";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Collapse from "@material-ui/core/Collapse";

// Customer Components
import ProductTitle from "../../components/ProductTitle/ProductTitle";
import InstructionsRetro from "./01_Instructions/01_InstructionsRetro";
import PickRole from "./02_PickRole/02_PickRole";
import SetupFacilitator from "./03_Setup/03_SetupFacilitator";
import SetupParticipant from "./03_Setup/03_SetupParticipant";
import MeetingInProgress from "./04_MeetingInProgress/04_MeetingInProgress";
import FinishedMeeting from "./05_FinishedMeeting/05_FinishedMeeting";

// nanoid
import { nanoid } from "nanoid";

// CSS
import "./RetroPage.css";

function Retro() {
  // Steps
  const [retroStep, setRetroStep] = useState(4);
  const steps = [
    "Review instructions",
    "Select your role",
    "Create / Join a Retrospective",
    "Run your Retrospective",
    "Finish!",
  ];
  // Navigate through steps
  function previousStep() {
    setRetroStep(retroStep - 1);
  }
  function nextStep(role) {
    setRetroStep(retroStep + 1);
    if (!role) {
      return;
    } else if (role === "facilitator") {
      setParticipant({ ...participant, isFacilitator: true });
    } else if (role === "participant") {
      setParticipant({ ...participant, isFacilitator: false });
    }
  }

  // TODO: Store participant information - name, role, meta
  const dummyParticipant = {
    name: "Stefan",
    isFacilitator: true,
    avatar:
      "https://lh3.googleusercontent.com/a-/AOh14GjrxpdHOMzjCZ2apTkYwCdLkQz4ESxlQPd9hM8BdQA=s96-c",
  };
  const [participant, setParticipant] = useState({
    ...dummyParticipant,
  });

  // TODO: Meeting State
  const dummyMeeting = {
    roomId: 42069,
    type: "retro",
    subtype: "Start, Stop, Continue",
    columns: ["Start", "Stop", "Continue"],
    cards: [],
    meetingStarted: false,
    meetingFinished: false,
    meetingStartTime: null,
    meetingEndTime: null,
  };
  const [meeting, setMeeting] = useState({ ...dummyMeeting });

  // Socket.io
  const [socket, setSocket] = useState(null);

  // Check if this is an attempt to join
  useEffect(() => {
    function checkForJoin() {
      if (meeting.columnsmeetingStarted || retroStep === 2) {
        return;
      }
      // Get URL params
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.get("roomId") === null) {
        console.log("No attempt to join detected...");
        return;
      } else if (meeting.roomId === null) {
        console.log(`Joining roomId ${urlParams.get("roomId")}...`);
        // Not a facilitator
        setParticipant({ ...participant, isFacilitator: false });
        // Set Meeting Room ID
        setMeeting({ ...meeting, roomId: urlParams.get("roomId") });
        // Fast forward to Step 3
        setRetroStep(3);
      }
    }

    checkForJoin();
  });

  // Interactions with cards on the board
  //// 👉 2 types of sources - local, and socket
  ////// 👉  With local, we want to socket.emit the card
  ////// 👉  With socket, we want to avoid that to prevent an infinite loop
  function addCard({ source, card }) {
    // Clone state, create empty card
    const newState = { ...meeting };
    let newCard = {};

    // Check card source
    if (source === "socket") {
      newCard = card;
    } else if (source === "local") {
      newCard = {
        id: nanoid(),
        columnIndex: card.i,
        content: "",
        thumbsUp: 0,
        thumbsDown: 0,
        isDeleted: false,
      };
    }

    // Add the card to the board
    newState.cards.push(newCard);
    setMeeting(newState);

    // Emit from socket if source is local
    if (socket && source === "local") {
      socket.emit("addCard", newCard);
    }
  }
  function deleteCard({ source, id }) {
    // find the index of the card
    const newCards = [...meeting.cards];
    const index = newCards.findIndex((card) => card.id === id);
    newCards[index].isDeleted = true;
    setMeeting({ ...meeting, cards: newCards });

    // Emit from socket if source is local
    if (socket && source === "local") {
      socket.emit("deleteCard", id);
    }
  }
  function updateCardText({ source, id, content }) {
    const newCards = [...meeting.cards];
    const index = newCards.findIndex((card) => card.id === id);
    newCards[index].content = content;
    setMeeting({ ...meeting, cards: newCards });

    if (socket && source === "local") {
      socket.emit("updateCardText", { id, content });
    }
  }
  function updateCardVotes({ source, id, thumb }) {
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
  function moveCard({ source, id, direction }) {
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

  return (
    <div>
      <Collapse in={retroStep === 1} timeout={800}>
        <ProductTitle title="Retrospective">
          <p className="stepsTitleText">
            Real time, collaborative, and engaging retros that make a positive
            impact on your team.
          </p>
        </ProductTitle>
      </Collapse>

      <Stepper activeStep={retroStep - 1} style={{ background: "none" }}>
        {steps.map((label, index) => {
          return (
            <Step key={`RetroStep_${index}`}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {retroStep === 1 ? (
        <InstructionsRetro props={{ nextButton: nextStep }} />
      ) : null}

      {retroStep === 2 ? <PickRole props={{ previousStep, nextStep }} /> : null}

      {retroStep === 3 && participant.isFacilitator ? (
        <SetupFacilitator
          props={{
            previousStep,
            nextStep,
            participant,
            setParticipant,
            meeting,
            setMeeting,
          }}
        />
      ) : retroStep === 3 && participant.isFacilitator === false ? (
        <SetupParticipant
          props={{ previousStep, nextStep, participant, setParticipant }}
        />
      ) : null}

      {retroStep === 4 ? (
        <MeetingInProgress
          props={{
            meeting,
            setMeeting,
            addCard,
            deleteCard,
            updateCardText,
            updateCardVotes,
            moveCard,
            participant,
            socket,
            setSocket,
          }}
        />
      ) : null}
    </div>
  );
}

export default Retro;
