import { Box, Html } from "@react-three/drei";

function Handle({ ref, position, onClick, onPointerMissed }) {
  return (
    <group
      ref={ref}
      position={position}
      onClick={onClick}
      onPointerMissed={onPointerMissed}
    >
      {/* =============== Handle Info Overlay =============== */}
      <Html position={[0.2, 0.2, 0]}>
        <div className="text-nowrap pointer-events-none text-text dark:text-background">
          <div>{`x = ${ref.current?.position.x.toFixed(2)}`}</div>
          <div>{`y = ${ref.current?.position.y.toFixed(2)}`}</div>
          <div>{`z = ${ref.current?.position.z.toFixed(2)}`}</div>
        </div>
      </Html>
      {/* ==================== Handle Box ==================== */}
      <Box args={[0.1, 0.1, 0.1]} material-color="red" />
    </group>
  );
}

export default Handle;
