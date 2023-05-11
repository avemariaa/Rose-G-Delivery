import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";

export function CustomNextArrow(props) {
  const { className, style, onClick, arrowSize } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        color: "var(--background-color2)",
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <ArrowCircleRightIcon style={{ fontSize: arrowSize }} />
    </div>
  );
}

export function CustomPrevArrow(props) {
  const { className, style, onClick, arrowSize } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        color: "var(--background-color2)",
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <ArrowCircleLeftIcon style={{ fontSize: arrowSize }} />
    </div>
  );
}
