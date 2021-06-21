import '../styles/tailwind.css';
import { AppProps } from 'next/app';
import Axios from 'Axios';
import Navbar from '../components/navbar';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/auth';
import { SWRConfig } from 'swr';
 //url base que llama cada vez que se usa axios
Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';
Axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  try {
    const res = await Axios.get(url)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter(); //comprueba la ruta y si esta en login/registro no muestra navbar
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000, //cache swr
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
