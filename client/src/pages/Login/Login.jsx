import React, { useEffect, useRef, useContext, useLayoutEffect } from "react";
import Button from "../../components/Button";
import useFetch from "../../hooks/useFetch";
import style from "./Login.module.css";
import UserInfoContext from "../../context/UserInfoContext";
import { Link, useNavigate } from "react-router-dom";
import appStyles from "../../App.module.css";
import Error from "../../components/Error/Error";
import Loading from "../../components/Loading/Loading";

function Login() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const { setIsDriver, setToken } = useContext(UserInfoContext);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  const onSuccess = (res) => {
    localStorage.setItem("token", res.data);
    const isDriver = res.isDriver;
    localStorage.setItem("isDriver", `${isDriver}`);
    localStorage.setItem("userID", res.id);
    setIsDriver(isDriver);
    setToken(res.data);
    navigate("/dashboard", {
      replace: true,
    });
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/authentication",
    onSuccess
  );
  useEffect(() => {
    return cancelFetch;
  }, []);

  function submitHandler(e) {
    e.preventDefault();
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    performFetch({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  }

  return (
    <div className={style.login}>
      <h1 className={appStyles.h1Desktop}>Log in</h1>
      <form onSubmit={submitHandler}>
        <div>
          <input
            name="email"
            required
            ref={emailInputRef}
            type="email"
            aria-label="email"
            placeholder="Email"
            className={style.loginInput}
          />
        </div>
        <div>
          <input
            name="password"
            required
            ref={passwordInputRef}
            type="password"
            aria-label="password"
            placeholder="Password"
            className={style.loginInput}
          />
        </div>
        <div className={style.singleButton}>
          <Button type="submit">Log in</Button>
        </div>
      </form>
      <div className={appStyles.bodyDesktop}>
        Don&apos;t have an account? <Link to="/user/create">Sign up</Link>
      </div>
      {isLoading && <Loading />}
      {error != null && <Error error={error} />}
    </div>
  );
}

export default Login;
