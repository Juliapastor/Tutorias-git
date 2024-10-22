import './App.css';
import { supabase } from './supabase/supabaseClient';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null)
 
  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user)
    const {data: authlistener} = supabase.auth.onAuthStateChange((event, session) => {
      switch(event){
        case "SIGNED_IN":
          setUser(session?.user );
          break;
        case "SIGNED_OUT":
          setUser(null);
          break;
        default:
      }
    })

    return () => {
      authlistener.subscription.unsubscribe();
    }
  }, [])
  
  const login = async() => {
    await supabase.auth.signInWithOAuth({
      provider: "github"
    })
  }
  const logout = async () => {
    await supabase.auth.signOut()
  }
 

  return (
    <div className="App">
      {user?(
        <div>
        <h1>autheticated</h1>
        <button onClick={logout}>logout</button>
        </div>
      ) : (
      <button onClick={login}>Inicia sesión con Github</button>
    )}
    </div>
  );
}

export default App;