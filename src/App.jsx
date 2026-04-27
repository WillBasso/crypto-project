import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages/Home"; // Main page: crypto list with search + sort
import { CoinDetail } from "./pages/CoinDetail"; // Detail page: single coin with chart

function App() {
  return (
    <BrowserRouter> {/* Enables client-side routing (HTML5 History API) */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page: top 100 coins grid */}
        <Route path="/coin/:id" element={<CoinDetail />} /> {/* Coin detail: :id is dynamic (e.g., "bitcoin") */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
