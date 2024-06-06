import List from "./List";
import Operation from "./Operation";
import "./index.scss";

function Home() {
  return (
    <div className="pageHome">
      <List />
      <Operation/>
    </div>
  );
}

export default Home;
