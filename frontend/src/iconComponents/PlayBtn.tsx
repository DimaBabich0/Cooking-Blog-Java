import * as React from "react";
import type { SVGProps } from "react";
const SvgPlayBtn = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="currentColor"
      d="M9.75 0a9.75 9.75 0 1 0 9.75 9.75A9.76 9.76 0 0 0 9.75 0m3.416 10.374-4.5 3A.749.749 0 0 1 7.5 12.75v-6a.75.75 0 0 1 1.166-.624l4.5 3a.75.75 0 0 1 0 1.248"
    />
  </svg>
);
export default SvgPlayBtn;
