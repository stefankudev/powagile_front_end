import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));
//checkbox, for the moment is not doing anything, only visual aspect;
//changed array of listItems to an array of objject so we can use the proprety of comment;
//!!!need to find a way to display it in <ListItemSecondaryAction> tag.
const listItems = [
  {
    title: "1. Prep - 5 min",
    comment:
      "For remote teams, start by creating a collaboration document, such as a Trello board or Confluence page. You can use the templates provided, if you’d like, or create one of your own. For in-person teams, find a whiteboard or large paper and set out sticky notes and markers in a meeting room. Create six columns labeled Milestones, LOVED, LOATHED, LONGED FOR, LEARNED, and Actions. Before the session, agree as a team on the time period you’d like to look back on.",
  },
  {
    title: "2. Set the stage - 5 min",
    comment:
      "Let your team know the following at the start of the meeting: The reason we’re taking the time to talk about how we have worked is to see how we can make improvements. We’re coming into this meeting understanding that everyone did the best that they could given their knowledge and tools. This meeting is a safe space. Nothing that is shared will be used against anyone. We’re here to explore, not to blame.",
  },
  {
    title: "3. Key moments - 5 min",
    comment:
      "Have the team think back over the chosen time period. What were the key events that occured? Provide a few examples, such as goals met, team celebrations, team members joining, company events. Anchoring the team in key milestones jogs the team’s memory of events that occurred and how they felt about them. Then set a timer for 5 minutes for people to add their own key events to the Milestone column.",
  },
  {
    title: "4. Reflect - 10 min",
    comment:
      "Explain the four lists to the team: LOVED, LONGED FOR, LOATHED and LEARNED. LOVED: what you loved about your work over the time period. This is what you want to keep doing, or do more of, in the future. LONGED FOR: what you wish you’d had. It could be more people, more time, more coffee. Nothing is off the table. LOATHED: what made life worse back then. What do you hope will never happen again? LEARNED: what you learned from your successes and your mistakes. Set a timer for 10 minutes for everyone to add their own thoughts to each list.",
  },
  {
    title: "5. Decide what to do - 15 min",
    comment:
      "Give everyone 10 minutes, as a team or in breakout groups, to discuss: One action you’ll take to remove something from your LOATHED list. One action you’ll take to amplify something from your LOVED list. Use your LONGED FOR and LEARNED lists to help shape your ideas for what actions to take.",
  },
  {
    title: "6. Share your action plan - 15 min",
    comment:
      "Give each person or group a few minutes to share their plan. Use the actions list to capture each action. Make sure to include who will do it, what they are doing, and by when.",
  },
  {
    title: "7. Wrap up - 10 min",
    comment:
      "Commit to when you’ll track progress on actions on a regular basis, such as at team meetings or at the next 4Ls.",
  },
];

export default function CheckboxList() {
  const classes = useStyles();
  const [checked, setChecked] = useState([0]);
  // const [commentVisible, setCommentVisible] = useState(false);

  const handleToggle = (listItems) => () => {
    const currentIndex = checked.indexOf(listItems);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(listItems);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  // function displayCom() {
  //   alert(listItems.comment);
  //   setCommentVisible(true);
  // }
  return (
    <List className={classes.root}>
      {listItems.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value.title}
            role={undefined}
            dense
            button
            onClick={handleToggle(value)}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`${value.title}`} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="comments"
                primary={`${value.comment}`}
                // onClick={displayCom}
              >
                <CommentIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
