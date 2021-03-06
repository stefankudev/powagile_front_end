// Material UI
import Card from "@material-ui/core/Card";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

// Icons
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";

// CSS
import "./RetroCard.css";

export default function RetroCard({ props, functions }) {
  const { card, meeting, participant } = props;
  const { id, columnIndex, content, thumbsUp, thumbsDown } = card;
  const { updateCardText, updateCardVotes, deleteCard, moveCard } = functions;
  const source = "local";

  return (
    <Card className="retroCard">
      <div className="deleteIconContainer">
        <IconButton
          className="retroCardDeleteButton"
          size="small"
          onClick={() => deleteCard({ source, id })}
        >
          <DeleteIcon />
        </IconButton>
      </div>

      <TextareaAutosize
        className="retroCardTextField"
        rowsMin={4}
        placeholder="Your card text"
        varian="standard"
        value={content}
        onChange={(e) =>
          updateCardText({ source, id, content: e.target.value })
        }
      />

      <ButtonGroup fullWidth variant="text" size="small">
        <Button
          disabled={columnIndex === 0}
          onClick={() => moveCard({ source, id, direction: "left" })}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          disabled={participant.votedOn.includes(id)}
          onClick={() => updateCardVotes({ source, id, thumb: "thumbsDown" })}
        >
          {thumbsDown}&nbsp;
          <ThumbDownIcon />
        </Button>

        <Button
          disabled={participant.votedOn.includes(id)}
          onClick={() => updateCardVotes({ source, id, thumb: "thumbsUp" })}
        >
          {thumbsUp}&nbsp;
          <ThumbUpIcon />
        </Button>
        <Button
          disabled={columnIndex === meeting.columns.length - 1}
          onClick={() => moveCard({ source, id, direction: "right" })}
        >
          <ChevronRightIcon />
        </Button>
      </ButtonGroup>
    </Card>
  );
}
