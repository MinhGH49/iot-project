import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SensorChart from "./screens/SensorDataChart";
import Login from "./screens/Login";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/dashboard" element={<SensorChart />}></Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
