import money from "../../assets/money.jpg";

const GridBackground = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${money})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
};
export default GridBackground;
