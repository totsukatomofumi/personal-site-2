function Line({ ref, children, className, ...props }) {
  // ================ Render ================
  // This component is purely for styling and semantics.
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}

export default Line;
