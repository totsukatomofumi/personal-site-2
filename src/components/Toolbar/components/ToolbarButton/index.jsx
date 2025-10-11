function ToolbarButton({ children, className, icon, ...props }) {
  // A button styled for use in the toolbar, with hover and active effects.
  return (
    <button
      className={`w-8 h-8 flex items-center justify-center gap-2 
        hover:cursor-pointer hover:scale-110 
        disabled:hover:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 
        active:scale-90 
        transition 
        ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export default ToolbarButton;
