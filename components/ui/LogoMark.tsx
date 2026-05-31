export function LogoMark({ size = 26 }: { size?: number }) {
  const h = Math.round((size * 161) / 142);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 142 161"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 148.039V59.0391L53.5 104.438"
        stroke="#F5F2ED"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M130.5 103.039V19.0391L85.5 67.2944"
        stroke="#F5F2ED"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 18.0391L130.5 147.039"
        stroke="#FB3640"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}
