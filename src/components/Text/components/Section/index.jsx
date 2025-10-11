import { Line } from "./components";

function Section({ ref, children, className, ...props }) {
  // This component is purely for styling and semantics.
  return (
    <section ref={ref} className={className} {...props}>
      {children}
    </section>
  );
}

Section.Line = Line;

export default Section;
