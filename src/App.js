import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Routes from "./routes/Routers";
import "./App.css";

import Bag from "./pages/Bag";
import { useSelector } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const showBag = useSelector((state) => state.bagUi.bagIsVisible);
  const autoCloseTime = 1000;
  return (
    <div>
      <Header />
      <ToastContainer
        position="top-center"
        autoClose={autoCloseTime}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {showBag && <Bag />}

      <div>
        <Routes />
      </div>
      <Footer />
    </div>
  );
}

export default App;
