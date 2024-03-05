import "../css/style.css";

const Navbar = () => {
  return (
    // top will be a flex component, with 2 items
    <div className="navbar">
      <a>
        <h1>ChainChat</h1>
      </a>
      <div className="nav-items">
        <div>
          <a className="link" target="_blank" href="https://chainchat-team.github.io/chainchat-site/">
            Case Study
          </a>
        </div>
        <div>
          <a className="link" target="_blank" href="https://chainchat-team.github.io/chainchat-site/team/">
            Team
          </a>
        </div>
        <div>
          <a className="link" target="_blank" href="https://zoom-meets-production.up.railway.app/">
            Github
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
