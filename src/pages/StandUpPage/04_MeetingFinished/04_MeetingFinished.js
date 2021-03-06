// React
import { useEffect } from "react";

// CSS
import "./04_MeetingFinished.css";

// npm module - Confetti
import Confetti from "react-confetti";

// Material UI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { CardContent } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Zoom } from "@material-ui/core";
import { Fade } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

// Material Icons
import LockIcon from "@material-ui/icons/Lock";

// notistack
import { useSnackbar } from "notistack";

// Auth0
import { useAuth0 } from "@auth0/auth0-react";

// Environment variables
require("dotenv").config();
const { REACT_APP_BACK_END_URL } = process.env;

export default function MeetingFinished({ props }) {
  const { minutesPerParticipant, meeting } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const congratulationsMessages = [
    "You smashed it! 💪",
    "Agile rockstars! 🤘",
    "Way to go! 🎉",
    "Great job! 😍",
    "Well done! 💃",
    "Hip, hip, hurrah! 🙌",
    "Nice one! 🥳",
    "Oh yeah! 😎",
    "Awesome! 😃",
    "Great work, team! 😍",
    "Nice job! 👍",
    "Great work! 🎊",
  ];

  const valuableStats = [
    "⌚ Fastest average day of the week",
    "📆 Best time to schedule a StandUp",
    "⏩ Longest ever StandUp meeting",
    "🤏 Shortest ever StandUp meeting",
    "👩‍👧 StandUp with the fewest participants",
    "👨‍👨‍👧‍👧 StandUp with the most participants",
    "🌍 Number of people running StandUps at the same time",
    "⏯ Addicted to pausing the timer",
  ];

  function pickRandom(array) {
    const index = Math.floor(Math.random() * (array.length - 1));
    return array[index];
  }

  useEffect(() => {
    function postMeetingToDatabase() {
      try {
        fetch(`${REACT_APP_BACK_END_URL}/meetingStandUp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(meeting),
        })
          .then((response) => response.json())
          .then((data) =>
            enqueueSnackbar(
              "Your meeting was successfully saved to your account!",
              {
                persist: false,
                variant: "success",
              }
            )
          );
      } catch (err) {
        console.error(err);
        enqueueSnackbar(err, {
          persist: false,
          variant: "error",
        });
      }
    }

    if (user && isAuthenticated) {
      postMeetingToDatabase();
    }
  });

  console.log({ minutesPerParticipant, meeting });

  function calculateTotalMeetingTime() {
    const { meetingStartTime, meetingEndTime } = meeting;
    const ms = meetingEndTime - meetingStartTime;

    let seconds = Math.floor(ms / 1000);
    let minutes = 0;

    while (seconds > 59) {
      seconds = seconds - 60;
      minutes = minutes + 1;
    }

    let str = `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;

    return str.match(/(\d\d:\d\d)/g) && str !== "00:00" ? str : "Too quick!";
  }

  function findFastest() {
    let arr = meeting.meetingParticipants;

    const fastest = arr.reduce((acc, cur) => {
      return cur.timeLeft > acc.timeLeft ? cur : acc;
    });

    return fastest.name;
  }

  function findSlowest() {
    let arr = meeting.meetingParticipants;

    const slowest = arr.reduce((acc, cur) => {
      return cur.timeLeft < acc.timeLeft ? cur : acc;
    });

    return slowest.name;
  }

  return (
    <div>
      <Confetti numberOfPieces={150} recycle={true} />
      <section className="finishedTitleArea">
        <h3 className="meetingFinishedTitle">
          {pickRandom(congratulationsMessages)}
        </h3>
        <h4 className="meetingFinishedSubtitle">You finished your stand up</h4>
      </section>
      <br />
      <Grid container spacing={3}>
        <Grid item xs>
          <Zoom in={true} timeout={1000}>
            <Card className="statCard">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  ⌚ Total meeting time
                </Typography>
                <Typography variant="h5" component="h2">
                  {calculateTotalMeetingTime()}
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs>
          <Zoom in={true} timeout={1500}>
            <Card className="statCard">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  ⚡ Life in the fast lane
                </Typography>
                <Typography variant="h5" component="h2">
                  {findFastest()}
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
        <Grid item xs>
          <Zoom in={true} timeout={2000}>
            <Card className="statCard">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  ☕ Could use a coffee
                </Typography>
                <Typography variant="h5" component="h2">
                  {findSlowest()}
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>
      <br />

      {user && isAuthenticated ? (
        <div>
          <Alert severity="success">
            Did you know? You can view detailed stats about your meetings in
            your account page.
          </Alert>
        </div>
      ) : (
        <div className="lockedStats">
          <Fade in={true} timeout={2500}>
            <div className="marketingMessage">
              <LockIcon fontSize="large" />
              <p className="salesyTitle">Unlock even more valuable stats</p>
              <p className="salesySubtitle">
                {" "}
                run better, faster, more productive meetings
              </p>

              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => loginWithRedirect()}
              >
                Sign Up for free &rarr;
              </Button>
            </div>
          </Fade>

          <div className="blurryStats">
            <Grid container spacing={3}>
              {valuableStats.map((el, i) => (
                <Zoom in={true} timeout={1200 * (i + 1)}>
                  <Grid item xs={6} sm={3}>
                    <Card className="statCard">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          {el}
                        </Typography>
                        <Typography variant="h5" component="h2">
                          ???
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Zoom>
              ))}
            </Grid>
          </div>
        </div>
      )}
    </div>
  );
}
