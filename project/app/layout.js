import NavBar from "./components/NavBar"
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        </body>
      </html>
    
  )
}