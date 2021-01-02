// Material UI
import Card from "@material-ui/core/Card";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Input } from "@material-ui/core";
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
  const { index, card, meeting, setMeeting } = props;
  const { columnIndex, columnName, content, thumbsUp, thumbsDown } = card;
  const { deleteCard, moveCard } = functions;

  return (
    <Card className="retroCard">
      <TextareaAutosize
        className="retroCardTextField"
        rowsMin={4}
        placeholder="Your card text goes here..."
        onChange={(e) => console.log(e.target.value)}
      />
      <IconButton
        className="retroCardDeleteButton"
        size="small"
        onClick={() => deleteCard(index)}
      >
        <DeleteIcon size="small" />
      </IconButton>

      <ButtonGroup fullWidth variant="text" size="small" color="black">
        <Button
          disabled={columnIndex === 0}
          onClick={() => moveCard(index, "left")}
        >
          <ChevronLeftIcon />
        </Button>
        <Button>
          {thumbsDown}&nbsp;
          <ThumbDownIcon />
        </Button>
        <Button>
          {thumbsUp}&nbsp;
          <ThumbUpIcon />
        </Button>
        <Button
          disabled={columnIndex === meeting.columns.length - 1}
          onClick={() => moveCard(index, "right")}
        >
          <ChevronRightIcon />
        </Button>
      </ButtonGroup>
    </Card>
  );
}
