import React, {useState} from "react";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";

const AdvancedSearch = React.memo(() => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div
      className={isOpen ? "advanced-search open" : "advanced-search"}
      onClick={() => {
        setOpen(!isOpen);
      }}
    >
      <h4>Show Advanced Search</h4>
      <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
    </div>
  );
});

export default AdvancedSearch;
