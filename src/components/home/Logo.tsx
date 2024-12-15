import { Compass } from "lucide-react";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="bg-[#E8F4FF] p-3 rounded-full">
        <Compass className="h-6 w-6 text-[#00A9FF]" />
      </div>
      <div className="text-2xl font-bold">
        <span className="text-[#00A9FF]">TUNI</span>
        <span className="text-red-500">GO</span>
      </div>
    </div>
  );
};

export default Logo;
