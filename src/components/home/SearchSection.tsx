import SearchBar from "./SearchBar";

interface SearchSectionProps {
  location?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  onExplore?: () => void;
}

const SearchSection = ({
  location,
  placeholder,
  onSearch,
  onExplore,
}: SearchSectionProps) => {
  return (
    <div className="w-full bg-gray-50 py-6 px-4">
      <div className="max-w-md mx-auto flex flex-col items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Discover Tunisia's Hidden Gems
        </h1>
        <p className="text-sm text-gray-600 text-center">
          Explore the best destinations, hotels, restaurants, and experiences
          across Tunisia
        </p>
        <div className="w-full mt-4">
          <SearchBar
            location={location}
            placeholder={placeholder}
            onSearch={onSearch}
            onExplore={onExplore}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
