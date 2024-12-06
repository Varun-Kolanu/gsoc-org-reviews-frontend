import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageTitle from './components/PageTitle';
import SignIn from './pages/SignIn';
import PrivateRoute from "./components/PrivateRoute";
import { UserProvider } from "./context/context";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import BackendRedirection from "./pages/BackendRedirection";
import Layout from "./layout/Layout";

function App() {

  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route
            path="/backend_redirect"
            element={<BackendRedirection />}
          />

          <Route
            path="/login"
            element={
              <>
                <PageTitle title="Login | GSoC Org Reviews" />
                <SignIn />
              </>
            }
          />

          <Route
            path="/"
            element={
              <UserProvider>
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              </UserProvider>
            }
          >
            <Route
              index
              element={
                <>
                  <PageTitle title="Organizations" />
                  <Home />
                </>} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
