import "./login.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error , setError ] = useState("");
  const [ isloading , setLoading ] = useState(false);

  const { updateUser } = useContext( AuthContext );
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading( true );
    setError("");

    const formData = new FormData(e.target);

    const username = formData.get("username")
    const password = formData.get("password")

    try {
      const res = await apiRequest.post("/auth/login" , {
        username , password
      });

      updateUser( res.data );

      navigate("/");
    } catch ( error ) {
      setError( error.response.data.message)
    } finally {
      setLoading( false );
    } 
  }

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit = { handleSubmit }>
          <h1>Welcome back</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" />
          <input name="password" required  type="password" placeholder="Password" />
          <button disabled={isloading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
