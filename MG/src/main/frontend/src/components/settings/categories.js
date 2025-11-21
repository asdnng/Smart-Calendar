import { BsChevronLeft, BsCircleFill, BsPlusCircle } from 'react-icons/bs';

import { Categories } from '../Categories';

function TaskCategories({ onBack }) {
  return ( 
    <>
      <form className="categories m-3 pb-1 rounded-3 text-black">
        <h4 className="d-flex ms-4 pt-3 align-items-center text-white">
          <BsChevronLeft className="me-3 cursor-pointer" onClick={onBack} />
          Task categories
        </h4>

        <div className="categories-content m-3 p-2 rounded-4 bg-white">
          {Categories.map((c) => (
            <div className="d-flex m-2 my-1 p-2 border rounded-pill bg-light align-items-center">
              <BsCircleFill
                className="mx-3"
                size={20}
                style={{ color: c.color }}
              />
              {c.label}
            </div>
          ))}

          <div className="d-flex m-2 my-1 p-2 border rounded-pill bg-light align-items-center text-secondary">
            <BsPlusCircle className="mx-3" size={20} />
            Add new category
          </div>
        </div>
      </form>
    </>
  );
}

export default TaskCategories;