import '../styles/tailwind.css'
import { AppProps } from "next/app";
import Axios from "Axios";
import Navbar from '../components/navbar';
import { Fragment } from 'react';
import { useRouter } from 'next/router'

Axios.defaults.baseURL = 'http://localhost:5000/api'; //url base que llama cada vez que se usa axios
Axios.defaults.withCredentials = true

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter() //comprueba la ruta y si esta en login/registro no muestra navbar
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname)
  
  return <Fragment>
    {!authRoute ? <Navbar /> : ''}
    <Component {...pageProps} />
  </Fragment>
}

export default App