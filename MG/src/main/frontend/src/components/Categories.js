import { useState, useEffect } from 'react';

import { BsBookmarkFill } from 'react-icons/bs';

export const Categories = [
  { value: "personal", label: "Personal", color: "rgba(89, 122, 201, 1)" },
  { value: "work", label: "Work", color: "rgba(142, 110, 181, 1)" },
  { value: "study", label: "Study", color: "rgba(101, 161, 110, 1)" },
  { value: "other", label: "Other", color: "rgba(130, 130, 130, 1)" }
];

export const changeColorOpacity = (rgbaString, newOpacity) => {
  const match = rgbaString.match(/rgba?\(([^)]+)\)/);
  if (!match) return rgbaString;

  const components = match[1].split(',');
  const rgb = components.slice(0, 3);
  return `rgba(${rgb.join(', ')}, ${newOpacity})`;
};

export const taskCategoryColor = (taskCategory) => {
  const normalizedCategory = taskCategory ? taskCategory.toLowerCase() : null;
  const category = Categories.find((c) => c && c.value === normalizedCategory);
  const defaultColor = "rgba(130, 130, 130, 0.65)";

  return category?.color || defaultColor;
};

function SelectCategory({ selected, onSelect }) {
  const [tagColor, setTagColor] = useState("#f3ebeb");

  const handleTagColor = (value) => {
    const selectedCategory = Categories.find((c) => c.value === value);
    if (selectedCategory) { setTagColor(selectedCategory.color); }
    else { setTagColor("white"); }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    onSelect(value);
    handleTagColor(value);
  }

  useEffect(() => {
    if (selected) handleTagColor(selected);
  }, []);

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
        className="form-select cursor-pointer bg-transparent"
        value={selected}
        onChange={handleChange}
        required
      >
        <option value="" disabled hidden>
          -- Select category --
        </option>
        {Categories.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectCategory;