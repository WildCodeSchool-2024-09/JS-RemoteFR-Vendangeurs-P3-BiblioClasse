import { useState } from "react";
import "../styles/Buttons.css";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");

  const handleSearchButtonClick = () => {
    setIsVisible(!isVisible);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(event.target.value);
    onSearch(event.target.value);
  };

  const getPlaceholder = () => {
    const path = location.pathname;
    switch (path) {
      case "/bibliotheque":
        return "Rechercher par titre ou auteur...";
      case "/classe":
        return "Rechercher par nom ou prénom";
      default:
        return "Rechercher...";
    }
  };

  return (
    <div className="searchbar">
      <button
        type="button"
        className={`search_button ${isVisible ? "active" : ""}`}
        onClick={handleSearchButtonClick}
      >
        <img src="/src/assets/images/loupe.png" alt="Search" />
      </button>
      {isVisible && (
        <input
          type="text"
          className="search_input"
          placeholder={getPlaceholder()}
          value={searchTitle}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
}

export default SearchBar;
