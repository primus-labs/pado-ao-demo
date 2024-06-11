import List from "./List";
import Operation from "./Operation";
import { CounterProvider } from "./CounterContext";
import "./index.scss";

function Home() {
  return (
    <div className="pageHome">
      <CounterProvider>
        <List />
        <Operation />
      </CounterProvider>
    </div>
  );
}

export default Home;
