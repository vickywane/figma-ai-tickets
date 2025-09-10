import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createMemoryRouter, RouterProvider, Outlet, Link, MemoryRouter, useLocation, Routes, Route  } from "react-router-dom";
import { createSupbaseClient } from "../clients/supabase";
import { LOGOUT_USER, SET_USER_AUTH, SET_USER_CLIENT_AUTH } from "../consts/messages";

import useUserStore from "../stores/user";
import { AuthEvents } from "../consts/events";
const supabase = createSupbaseClient();

const Home = () => (
  <div>
    <h1>FIGMA PLUGIN</h1>
    <p>Home Page</p>
  </div>
);

const Settings = () => (
  <div>
    <h1>Settings</h1>
    <p>Settings Page</p>
  </div>
);

const Layout = () => (
  <div>
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "10px", textDecoration: "none" }}>Home</Link>
      <Link to="/settings" style={{ textDecoration: "none" }}>Settings</Link>
    </nav>
    <div style={{ padding: "20px" }}>
      <Outlet />
    </div>
  </div>
);

const router = createMemoryRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

const About = () => (
  <div>
    <h2>About</h2>
    <p>This is the about page of the Figma plugin.</p>
  </div>
);

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav style={{ marginBottom: '20px' }}>
      <Link 
        to="/" 
        style={{ 
          marginRight: '10px', 
          textDecoration: location.pathname === '/' ? 'underline' : 'none' 
        }}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        style={{ 
          marginRight: '10px', 
          textDecoration: location.pathname === '/about' ? 'underline' : 'none' 
        }}
      >
        About
      </Link>
      <Link 
        to="/settings"
        style={{ 
          textDecoration: location.pathname === '/settings' ? 'underline' : 'none' 
        }}
      >
        Settings
      </Link>
    </nav>
  );
};


const AuthWrapper = ({ children }) => {
  const [session, setSession] = useState(null);
  const { setUser } = useUserStore((state) => state);

  // onmessage = async (event) => {
  //   const msg = event.data.pluginMessage;

  //   if (msg.type === SET_USER_CLIENT_AUTH) {
  //     supabase.auth.setSession({
  //       access_token: msg.data.access_token,
  //       refresh_token: msg.data.refresh_token,
  //     });
  //   }
  // };

  // return <RouterProvider router={router} />;
  return (
    <MemoryRouter>
      <main>
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </MemoryRouter>
  )
};

export default AuthWrapper;
