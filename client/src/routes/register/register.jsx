import "./register.scss";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [error , setError ] = useState("");
  const [isloading , setLoading ] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username")
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const res = await apiRequest.post("/auth/register" , {
        username , email , password
      })

      navigate("/login");
    } catch ( error ) {
      setError( error.response.data.message)
    } finally {
      setLoading( false );
    }
  }

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isloading} >Register</button>
          { error && <span>{error}</span> }
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
