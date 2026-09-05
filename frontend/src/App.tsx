import { useState } from "react";
import "./App.css";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Acceuil } from "./pages/Acceuil";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { isLoggedIn } = useAuth();

  const [showRegister, setShowRegister] = useState(false);

  if (isLoggedIn) {
    return <Acceuil />;
  }

  if (showRegister) {
    return (
      <Register
        onLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <Login
      onRegister={() => setShowRegister(true)}
      onLoginSuccess={() => {}}
    />
  );
}

export default App;
