import { BsSortDownAlt } from 'react-icons/bs';

function Sort({ sortValue, sortChange }) {
  return (
    <div className="sort-tasks">
      <BsSortDownAlt className="me-2 text-white fs-2"/>
      <select 
        className="mx-2 px-3 py-2 rounded-pill bg-white cursor-pointer"
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