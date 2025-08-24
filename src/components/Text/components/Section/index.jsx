import { Line } from "./components";

function Section({ ref, children, className, ...props }) {
  // Line animations are managed here, registering them with the app context

  return (
    <section ref={ref} className={className} {...props}>
      {children}
    </section>
  );
}

Section.Line = Line;

export default Section;
