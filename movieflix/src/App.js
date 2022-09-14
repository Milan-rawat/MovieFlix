import "./App.css";

import { Redirect, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddMovie from "./pages/AddMovie";
import UpdateForm from "./Components/UpdateForm";
import MovieDetail from "./Components/MovieDetail";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact={true}>
          <Redirect to="/home" />
        </Route>
        <Route path="/home" exact={true}>
          <Home />
        </Route>
        <Route path="/admin" exact={true}>
          <Dashboard />
        </Route>
        <Route path="/admin/addMovie" exact={true}>
          <AddMovie />
        </Route>
        <Route path="/admin/movie/edit/:id" exact={true}>
          <UpdateForm />
        </Route>
        <Route path="/admin/movie/:id" exact={true}>
          <MovieDetail />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
