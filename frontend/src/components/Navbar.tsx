import "../css/style.css";

const Navbar = () => {
  return (
    // top will be a flex component, with 2 items
    <div className="navbar">
      <a>
        <h1>Zoom Meets</h1>
      </a>
      <div className="nav-items">
        <div>
          <a className="link" target="_blank">
            Case Study
          </a>
        </div>
        <div>
          <a className="link" target="_blank">
            Team
          </a>
        </div>
        <div>
          <a className="link" target="_blank">
            Github
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
