import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import supabase from './supabaseClient';
import Auth from './Auth';
import Account from './Account';

function App() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container">
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  );
}

export default App;
