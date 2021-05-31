import Link from 'next/link';
//import Logo from '../images/logo.svg';
import { useAuthState, useAuthDispatch } from '../context/auth';
import Axios from 'Axios';
import { Fragment, useState } from 'react';
import { Sub } from '../types';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [name, setName] = useState('');
  const [subs, setSubs] = useState<Sub[]>([]);

  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const logout = () => {
    Axios.get('/auth/logout')
      .then(() => {
        dispatch('LOGOUT');
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const searchSubs = async (subName: string) => {
    setName(subName);

    try {
      const { data } = await Axios.get(`/subs/search/${subName}`);
      setSubs(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white'>
      {/* Logo y título */}
      <div className='flex items-center'>
        <Link href='/'>
          <a>
            {/*<Logo classname='w-8 h-8 mr-2' />*/} {/* SVG LOGO */}
          </a>
        </Link>
        <span className='font-semibold text-2x1'>
          <Link href='/'>Teselar</Link>
        </span>
      </div>

      {/* Busqueda */}
      <div className='relative flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white'>
        <i className='pl-4 pr-3 text-gray-500 fas fa-search'></i>
        <input
          type='text'
          placeholder='Buscar...'
          className='py-1 pr-3 bg-transparent rounded w-160 focus:outline-none'
          value={name}
          onChange={(e) => searchSubs(e.target.value)} //busqueda rapida - demasiadas requests
        />
        {/** resultados de busqueda */}
        <div
          className='absolute left-0 right-0 bg-white'
          style={{ top: '100%' }}
        >
          {subs?.map((sub) => (
            <div className='flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200'>
              <Image
                src={sub.imageUrl}
                className='rounded-full'
                alt='Sub'
                height={(8 * 16) / 4}
                width={(8 * 16) / 4}
              />
              <div className="ml-4 text-sm">
                <p className="font-medium">{sub.name}</p>
                <p className='text-gray-600'>{sub.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* botones login-registro */}
      <div className='flex'>
        {!loading &&
          (authenticated ? (
            //mostrar logout
            <button
              className='w-32 py-1 mr-4 leading-5 hollow blue button'
              onClick={logout}
            >
              Salir
            </button>
          ) : (
            <Fragment>
              <Link href='/login'>
                <a className='w-32 py-1 mr-4 leading-5 hollow blue button'>
                  Entrar
                </a>
              </Link>
              <Link href='/register'>
                <a className='w-32 py-1 mr-4 leading-5 blue button'>
                  Registrarse
                </a>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
