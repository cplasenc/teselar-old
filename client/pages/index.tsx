import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
//import Logo from '../images/logo.svg';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Teselar: bla bla bla</title>
      </Head>

      <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 bg-white">
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
        <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i className='pl-4 pr-3 text-gray-500 fas fa-search' />
          <input type="text" className='py-1 pr-3 bg-transparent rounded w-160 focus:outline-none'/>
        </div>

        {/* botones login-registro */}
      </div>
    </div>
  )
}
