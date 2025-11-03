import { Html } from "@react-three/drei";

const InfoOverlay = ({ position, gap, repeat, setRepeat, speed, setSpeed }) => {
  const AddButton = ({ onClick }) => (
    <button onClick={onClick}>
      <div className="ml-2 w-8 rounded bg-green-400">+</div>
    </button>
  );

  const SubtractButton = ({ onClick }) => (
    <button onClick={onClick}>
      <div className="ml-2 w-8 rounded bg-red-400">-</div>
    </button>
  );

  return (
    <Html position={position}>
      <div className="text-nowrap text-text dark:text-background">
        {/* ================== Gap Info ================== */}
        <div>{`gap = ${gap.toFixed(2)}`}</div>

        {/* ================= Repeat Controls ================= */}
        <div>
          {`repeat = ${repeat}`}
          <AddButton
            onClick={() => {
              setRepeat((prev) => prev + 1);
            }}
          />
          <SubtractButton
            onClick={() => {
              setRepeat((prev) => Math.max(1, prev - 1));
            }}
          />
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={repeat}
          onChange={(e) => setRepeat(parseInt(e.target.value))}
        />

        {/* ================= Speed Controls ================= */}
        <div>
          {`speed = ${speed.toFixed(2)}`}
          <AddButton
            onClick={() => {
              setSpeed((prev) => prev + 0.01);
            }}
          />
          <SubtractButton
            onClick={() => {
              setSpeed((prev) => Math.max(0, prev - 0.01));
            }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="0.01"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
        />
      </div>
    </Html>
  );
};

export default InfoOverlay;
