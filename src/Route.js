import React from  'react';
import {Redirect, Route} from 'react-router';

async function isLogin() {
  await fetch('/auth/check', {
    method: 'GET'
  })
  .then((res) => res.json())
  .then((data) => {
    return data.success;
  })
  .catch((error) => {
    console.log(error);
    return false;
  })
  return false;
}

// 접근 권한이 없을 때 메인 페이지로 Redirect
export const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  return(
    <Route
      {...rest}
      render={(props) => (isLogin() && restricted ? <Redirect to="/" /> : <Component {...props} />)}
    />
  )
}

// 접근 권한이 없을 때 로그인 페이지로 Redirect
export const PrivateRoute = ({ component: Component, ...rest }) => {
  return(
    <Route
      {...rest}
      render={(props) => (isLogin() ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  )
}