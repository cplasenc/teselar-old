import Link from 'next/link';
//import Logo from '../images/logo.svg';

const Navbar: React.FC = () => {
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
      <div className='flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white'>
        <i className='pl-4 pr-3 text-gray-500 fas fa-search'></i>
        <input
          type='text'
          placeholder='Buscar...'
          className='py-1 pr-3 bg-transparent rounded w-160 focus:outline-none'
        />
      </div>

      {/* botones login-registro */}
      <div className='flex'>
        <Link href='/login'>
          <a className='w-32 py-1 mr-4 leading-5 hollow blue button'>Entrar</a>
        </Link>
        <Link href='/register'>
          <a className='w-32 py-1 mr-4 leading-5 blue button'>Registrarse</a>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;