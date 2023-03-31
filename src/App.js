import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Auth from "./Routes/Auth";
import Console from "./Routes/Console";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster  } from "react-hot-toast";

import { getAuth, toogleAuth } from "./Components/Redux/Reducer/AuthReducer";

const App = () => {
  const authStatus = useSelector(getAuth);
 console.log("run");
  // useEffect(() => {
  //   if (authStatus == "LOGGEDOUT") {
  //     if (window.location.pathname != "/") {
  //       window.location.href = "/";
  //     }
  //   }
  // }, [authStatus]);

  if (window?.tronWeb) {
    window?.tronWeb.on("addressChanged", (e) => {
      window.location.reload();
    });
  }

  return (
      <BrowserRouter basename={process.env.PUBLIC_URL} >
      <Toaster/>
        {/* {access ? <Redirect to={"/"} /> : <Redirect to={"/login"} />} */}
        <Route
          to={"/"}
          // render={() => (authStatus == "LOGGEDIN" ? <Console /> : <Console />)}

          render={() => (authStatus == "LOGGEDIN" ? <Console /> : <Auth />)}
        />

      </BrowserRouter>
  );
};

export default App;

// <div className="container1">
// <Switch>
//   <Route exact path="/">
//     <div className="con2">
//       {/* <Topbar /> */}
//       <div className="con3">
//         <Sidenavbar />
//         <Controlpanel />
//       </div>
//     </div>
//   </Route>
//   <Route path="/Message">
//     <div className="con2">
//       <Topbar />
//       <div className="con3">
//         <Sidenavbar />
//         <Message />
//       </div>
//     </div>
//   </Route>
//   <Route path="/Partners">
//     <div className="con2">
//       <Topbar />
//       <div className="con3">
//         <Sidenavbar />
//         <Partners />
//       </div>
//     </div>
//   </Route>
//   <Route path="/Uplines">
//     <div className="con2">
//       <Topbar />
//       <div className="con3">
//         <Sidenavbar />
//         <Uplines />
//       </div>
//     </div>
//   </Route>
//   <Route path="/Lostprofits">
//     <div className="con2">
//       <Topbar />
//       <div className="con3">
//         <Sidenavbar />
//         <Lostprofits />
//       </div>
//     </div>
//   </Route>

//   <Route path="/auth">
//     <Login />
//   </Route>
// </Switch>
// </div>
