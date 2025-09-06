function Header() {
  return (
    <div className="row bg-secondary text-white p-3">
      <div className="col-2 text-center">
        <h4>MG project</h4>
      </div>
      <div className="col-8 text-center">
        <div className="bg-light d-flex justify-content-center align-items-center text-black p-2 mx-5">
          Search bar
        </div>
      </div>
      <div className="col-2 text-center">
        <h3>Profile</h3>
      </div>
    </div>
  );
}

export default Header;
