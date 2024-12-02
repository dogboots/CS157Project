
import NavBar from "./components/NavBar"
import Home from "./components/Home"
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
      <NavBar></NavBar>
        {children}
        </body>
      </html>
    
  )
}
