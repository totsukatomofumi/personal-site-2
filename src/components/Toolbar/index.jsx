import { ToolbarButton } from "./components";

function Toolbar({ children, className, ...props }) {
  // A container for toolbar buttons, laid out horizontally with spacing.
  return (
    <div
      className={`flex gap-3 text-text dark:text-background transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Toolbar.Button = ToolbarButton;

export default Toolbar;
