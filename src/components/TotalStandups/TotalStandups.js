import React, { useEffect, useState } from "react";
// React

export default function UserDashboard() {
  const [meetings, setMeetings] = useState([]);

  //Get meetings
  useEffect(() => {
    function retrieveMeetings() {
      fetch("https://powagile-back-end.herokuapp.com/meeting/getAll")
        .then((res) => res.json())
        .then((data) => setMeetings(data));
    }
    retrieveMeetings();
  }, []);

  function generateNumberOfStandups() {
    console.log(meetings);
    let numberOfStandups = 0;
    // eslint-disable-next-line array-callback-return
    meetings.map((obj) => {
      if (obj.type === "standup") {
        numberOfStandups++;
      }
    });
    return numberOfStandups;
  }

  generateNumberOfStandups();
  return <h3>Total Standups Held: {generateNumberOfStandups()}</h3>;
}
