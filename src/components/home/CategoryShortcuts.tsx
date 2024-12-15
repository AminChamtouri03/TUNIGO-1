import { useNavigate } from "react-router-dom";
import CategoryIcon from "./CategoryIcon";

type CategoryType = "Hotel" | "Destination" | "Food" | "Shopping" | "Transport";

interface Category {
  type: CategoryType;
  label: string;
  route?: string;
}

interface CategoryShortcutsProps {
  categories?: Category[];
  activeCategory?: CategoryType;
  onCategoryClick?: (category: CategoryType) => void;
}

const CategoryShortcuts = ({
  categories = [
    { type: "Hotel", label: "Hotel", route: "/hotels" },
    { type: "Destination", label: "Destination", route: "/discover" },
    { type: "Food", label: "Food", route: "/food" },
    { type: "Shopping", label: "Shopping", route: "/shopping" },
    { type: "Transport", label: "Transport", route: "/transport" },
  ],
  activeCategory,
  onCategoryClick = () => {},
}: CategoryShortcutsProps) => {
  const navigate = useNavigate();

  const handleClick = (category: Category) => {
    onCategoryClick(category.type);
    if (category.route) {
      navigate(category.route);
    }
  };

  return (
    <div className="w-full py-6">
      <div className="flex justify-between px-8">
        {categories.map((category) => (
          <CategoryIcon
            key={category.type}
            type={category.type}
            label={category.label}
            isActive={category.type === activeCategory}
            onClick={() => handleClick(category)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryShortcuts;
