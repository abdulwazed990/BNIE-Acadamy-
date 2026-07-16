// @ts-ignore
import officialLogo from "../assets/images/bnie_logo_1784204397108.jpg";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 100 }: LogoProps) {
  return (
    <img
      src={officialLogo}
      alt="Bangladesh National Institute of Education (BNIE) Logo"
      style={{ width: size, height: size }}
      className={`object-contain select-none mix-blend-multiply transition-all duration-300 ${className}`}
      referrerPolicy="no-referrer"
    />
  );
}
