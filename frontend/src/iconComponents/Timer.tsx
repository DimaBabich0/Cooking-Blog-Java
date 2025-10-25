import * as React from "react";
import type { SVGProps } from "react";
const SvgTimer = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M9.75 1.5h4.5a.75.75 0 1 0 0-1.5h-4.5a.75.75 0 1 0 0 1.5M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9m4.243 5.818L12.53 12.53a.75.75 0 0 1-1.06-1.06l3.712-3.713a.75.75 0 1 1 1.06 1.061"
    />
  </svg>
);
export default SvgTimer;
