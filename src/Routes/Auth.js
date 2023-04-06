import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import "../App.css";
import Login from "../Components/Login/Login";
import { getAuth } from "../Components/Redux/Reducer/AuthReducer";
import Register from "../Components/Register/Register";
import { Toaster } from "react-hot-toast";

function Auth() {
  const authStatus = useSelector(getAuth);


  useEffect(() => {
    if (authStatus == "LOGGEDOUT") {
      if(window.location.pathname.split("/")[1] != "register"){
        if (window.location.pathname != "/") {
          window.location.href = "/";
        }
      }
  
    }
  }, [authStatus]);

  return (
    <div>
            <Toaster/>

      <Route component={Login} exact path="/" />
      <Route component={Register} path="/register" />

    </div>
  );
}

export default Auth;
