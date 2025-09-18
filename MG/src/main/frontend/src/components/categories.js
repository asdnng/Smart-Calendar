import { useState } from 'react';

import { BsBookmarkFill } from 'react-icons/bs';

const categories = [
  { value: "personal", label: "Personal", color: "#597ac9" },
  { value: "work", label: "Work", color: "#8e6eb5" },
  { value: "study", label: "Study", color: "#65a16e" },
  { value: "other", label: "Other", color: "gray" }
];

function SelectCategory({ selected, onSelect }) {
  const [tagColor, setTagColor] = useState("#f3ebeb");

  const handleChange = (e) => {
    const value = e.target.value;
    onSelect(value);

    const selectedCategory = categories.find((c) => c.value === value);
    if (selectedCategory) { setTagColor(selectedCategory.color); }
    else { setTagColor("white"); }
  }

  return (
    <div className="category-option d-flex align-items-center">
      {/* TAG ICON */}
      <BsBookmarkFill
        className="mx-3"
        size={25}
        style={{ color: tagColor }}
      />

      {/* OPTION */}
      <select
        className="form-select bg-transparent"
        value={selected}
        onChange={handleChange}
        required
      >
        <option value="" disabled hidden>
          -- Select category --
        </option>
        {categories.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectCategory;