// React
import { useState, useEffect } from "react";

// Material UI
import { Input } from "@material-ui/core";
import { DialogTitle } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

// CSS
import "./StandUpPage.css";
import Timer from "../../components/Timer/Timer";

// Custom Componenets
import ParticipantCard from "../../components/MeetingParticipants/ParticipantCard/ParticipantCard";

export default function StandUpPage() {
  const [minutesPerParticipant, setMinutesPerParticipant] = useState(2);
  const [timeBetweenSpeakers, setTimeBetweenSpeakers] = useState(20);
  const [totalMeetingTime, setTotalMeetingTime] = useState(0);

  const [participants, setParticipants] = useState({
    participantBeingEntered: "",
    listOfParticipants: [],
  });

  // FIXME: Delete, Edit, Toggle functions not working

  function DeleteFunc(i) {
    console.log(i);

    // Don't delete if no index
    if (i === undefined) {
      console.log("No index passed to DeleteFunc");
      return;
    }
    // New state
    const newState = { ...participants };

    console.log(i);

    // Delete participant
    newState.listOfParticipants.splice(i, 1);

    // Set new state
    setParticipants(newState);
  }

  function EditNameFunc(i, name) {
    // Don't edit if no index
    if (i === undefined) {
      console.log("No index passed to EditNameFunc");
      return;
    }
    // New state
    const newState = { ...participants };
    // Add paticipant to list
    newState.listOfParticipants[i] = name;
    // Set new state
    setParticipants(newState);
  }

  function ToggleBeingEditedFunc(i) {
    // Don't toggle if no index
    if (i === undefined) {
      console.log("No index passed to toggleBeingEditedFunc");
      return;
    }
    // New state
    const newState = { ...participants };
    // Toggle participant edit status
    const participant = newState.listOfParticipants[i];
    participant.beingEdited = !participant.beingEdited;
    // Set new state
    setParticipants(newState);
  }

  useEffect(() => {
    calculateMeetingTime();
  });

  function calculateMeetingTime() {
    // How manu people?
    const people = participants.listOfParticipants.length;
    // How many minutes per person?
    const minutes = minutesPerParticipant;
    // How much time between speakers?
    const bufferTime = timeBetweenSpeakers;

    // Calculate (in seconds)
    const speakingTimeInSeconds = people * minutes * 60;
    const timeBetweenSpeakersInSeconds = people * bufferTime;

    // Sum, and convert to minutes
    const totalTimeInMinutes = Math.round(
      (speakingTimeInSeconds + timeBetweenSpeakersInSeconds) / 60
    );
    setTotalMeetingTime(totalTimeInMinutes);
  }

  function addParticipant(event) {
    event.preventDefault();
    // Don't add if field is empty
    if (participants.participantBeingEntered === "") {
      return;
    }
    // New state
    const newState = { ...participants };
    // Add paticipant to list
    newState.listOfParticipants.push({
      name: participants.participantBeingEntered,
      beingEdited: false,
    });
    // Set input field to blank
    newState.participantBeingEntered = "";
    // Set new state
    setParticipants(newState);
  }

  function inputFieldParticipantChange(event) {
    setParticipants({
      ...participants,
      participantBeingEntered: event.target.value,
    });
  }

  return (
    <div>
      <div className="participantsSection">
        <DialogTitle>Pow!Agile® StandUp™</DialogTitle>

        <p>Minutes per participant</p>

        <Input
          type="number"
          variant="outlined"
          defaultValue={minutesPerParticipant}
          onChange={(e) => setMinutesPerParticipant(Number(e.target.value))}
        />
        <br />
        <br />
        <p>Time between speakers (in seconds)</p>
        <Input
          type="number"
          variant="outlined"
          defaultValue={timeBetweenSpeakers}
          onChange={(e) => setTimeBetweenSpeakers(Number(e.target.value))}
        />
        <br />
        <br />

        <form onSubmit={addParticipant}>
          <Paper elevation={3}>
            <TextField
              label="Participant name"
              helperText="Enter one participant at a time"
              variant="outlined"
              value={participants.participantBeingEntered}
              onChange={inputFieldParticipantChange}
            />

            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>

            {participants.listOfParticipants
              ? participants.listOfParticipants.map((obj, i) => (
                  <ParticipantCard
                    index={i}
                    name={obj.name}
                    beingEdited={obj.beingEdited}
                    EditNameFunc={EditNameFunc}
                    DeleteFunc={DeleteFunc}
                    ToggleBeingEditedFunc={ToggleBeingEditedFunc}
                  />
                ))
              : null}
          </Paper>
        </form>

        {totalMeetingTime !== 0 ? (
          <p className="totalStandupTime">
            With this setup, you'll be done in about{" "}
            <b>{totalMeetingTime} minutes.</b> Ready to start?
          </p>
        ) : null}

        {totalMeetingTime !== 0 ? (
          <div>
            <Button size="medium" color="secondary">
              Go Back
            </Button>
            &nbsp;&nbsp;
            <Button size="large" color="primary" variant="contained">
              Start StandUp™
            </Button>
          </div>
        ) : null}
      </div>
      <Timer />
    </div>
  );
}
