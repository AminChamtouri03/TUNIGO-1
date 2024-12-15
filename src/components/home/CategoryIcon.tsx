import {
  Building2,
  Landmark,
  UtensilsCrossed,
  ShoppingBag,
  Car,
} from "lucide-react";

type CategoryType = "Hotel" | "Destination" | "Food" | "Shopping" | "Transport";

interface CategoryIconProps {
  type?: CategoryType;
  label?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const iconMap = {
  Hotel: Building2,
  Destination: Landmark,
  Food: UtensilsCrossed,
  Shopping: ShoppingBag,
  Transport: Car,
};

const CategoryIcon = ({
  type = "Hotel",
  label = type,
  onClick = () => {},
  isActive = false,
}: CategoryIconProps) => {
  const Icon = iconMap[type];

  return (
    <button className="flex flex-col items-center gap-2" onClick={onClick}>
      <div className="w-12 h-12 rounded-full bg-[#E8F4FF] flex items-center justify-center">
        <Icon className="h-6 w-6 text-[#00A9FF]" />
      </div>
      <span className="text-xs text-gray-600">{label}</span>
    </button>
  );
};

export default CategoryIcon;
