import * as React from "react";
import type { SVGProps } from "react";
const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16.502 3a5.61 5.61 0 0 0-4.5 2.246A5.627 5.627 0 0 0 1.877 8.625c0 6.737 9.36 12.056 9.759 12.28a.75.75 0 0 0 .733 0 29.8 29.8 0 0 0 4.822-3.52c3.276-2.947 4.936-5.895 4.936-8.76A5.63 5.63 0 0 0 16.502 3"
    />
  </svg>
);
export default SvgHeart;
