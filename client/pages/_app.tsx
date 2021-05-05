import '../styles/tailwind.css';
import { AppProps } from 'next/app';
import Axios from 'Axios';
import Navbar from '../components/navbar';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/auth';
import { SWRConfig } from 'swr';

Axios.defaults.baseURL = 'http://localhost:5000/api'; //url base que llama cada vez que se usa axios
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter(); //comprueba la ruta y si esta en login/registro no muestra navbar
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  return (
    <SWRConfig
      value={{
        fetcher: (url) => Axios.get(url).then((res) => res.data),
      }}
    >
      <AuthProvider>
        {!authRoute ? <Navbar /> : ''}
        <div className={authRoute ? '' : 'pt-12'}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
