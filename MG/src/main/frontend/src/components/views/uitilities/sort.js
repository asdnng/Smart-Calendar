import { BsSortDownAlt } from 'react-icons/bs';

function Sort({ sortValue, sortChange }) {
  return (
    <div className="sort-tasks">
      <BsSortDownAlt className="text-white fs-4"/>
      <select 
        className="mx-2 px-3 py-2 rounded-pill bg-white cursor-pointer fw-bold"
        value={sortValue}
        onChange={sortChange}
      >
        <option>date</option>
        <option>recently added</option>
      </select>
    </div>
  );
}

export default Sort;