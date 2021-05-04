import React from  'react';
import {Redirect, Route} from 'react-router';
import { useAsync } from 'react-async';

const isLogin = async() => {
  const response = await fetch('/auth/check', { method: 'GET', headers : { 'Cache-Control' : 'no-cache' }});
  return response.json();
}

// 접근 권한이 없을 때 메인 페이지로 Redirect
export const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const { data, error, isLoading } = useAsync({ promiseFn: isLogin })
  if(isLoading) return "Loading..."
  if(error) return error
  if(data)
    return(
      <Route
        {...rest}
        render={(props) => (data.success && restricted ? <Redirect to="/" /> : <Component {...props} />)}
      />
    )
}

// 접근 권한이 없을 때 로그인 페이지로 Redirect
export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { data, error, isLoading } = useAsync({ promiseFn: isLogin })
  if(isLoading) return "Loading..."
  if(error) return error
  if(data)
    return(
      <Route
        {...rest}
        render={(props) => (data.success ? <Component {...props} /> : <Redirect to="/login" />)}
      />
    )
}