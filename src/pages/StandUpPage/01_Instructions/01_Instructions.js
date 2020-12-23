// Material UI
import Button from "@material-ui/core/Button";

// Material UI Transitions
import Grow from "@material-ui/core/Grow";

// CSS
import "./01_Instructions.css";

export default function InstructionsPage({
  nextButton = null,
  backButton = null,
}) {
  return (
    <section className="getStartedPage">
      <h2 className="pageTitle" style={{ textAlign: "center" }}>
        <span className="companyName">Pow!Agile</span>{" "}
        <span className="productName">Stand-Up™</span>
      </h2>
      <p className="stepsTitleText">
        Fast, engaging, and productive standups. Every time.
      </p>
      <div className="stepsWrapper">
        <Grow in={true} {...(true ? { timeout: 1000 } : {})}>
          <div className="stepContainer">
            <span className="stepNumber">1</span>
            <p className="stepText">Enter your meeting participants</p>
          </div>
        </Grow>
        <Grow in={true} {...(true ? { timeout: 1500 } : {})}>
          <div className="stepContainer">
            <span className="stepNumber">2</span>
            <p className="stepText">Set your desired timing per person</p>
          </div>
        </Grow>
        <Grow in={true} {...(true ? { timeout: 2000 } : {})}>
          <div className="stepContainer">
            <span className="stepNumber">3</span>
            <p className="stepText">Enjoy a quick, producitve meeting!</p>
          </div>
        </Grow>
      </div>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={nextButton}
      >
        Get Started &rarr;
      </Button>
    </section>
  );
}
