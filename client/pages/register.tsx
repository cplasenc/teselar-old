import Head from 'next/head';
import Link from 'next/link';

export default function Register() {
  return (
    <div className='flex'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div
        className='w-40 h-screen bg-center bg-cover'
        style={{ backgroundImage: "url('images/main.png')" }}
      ></div>

      <div className='flex flex-col justify-center pl-6'>
        <h1 className='mb-2 text-lg'>Registro de usuario</h1>
        <p className='mb-10 text-xs'>bla bla bla</p>

        <form>
          <div className='mb-6'>
            <input
              type='checkbox'
              className='mr-1 cursor-pointer'
              id='agreement'
            />
            <label htmlFor='agreement' className='text-xs cursor-pointer'>
              Acepto los términos de uso y la política de privacidad
            </label>
          </div>

          <div className='mb-2'>
            <input
              type='email'
              className='w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded'
              placeholder='Email'
            />
          </div>
          <div className='mb-2'>
            <input
              type='text'
              className='w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded'
              placeholder='Nombre de usuario'
            />
          </div>
          <div className='mb-2'>
            <input
              type='password'
              className='w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded'
              placeholder='Contraseña'
            />
          </div>
          <button className='w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded'>
            Crear cuenta
          </button>
        </form>
        <small>
          ¿Ya tienes una cuenta?
          <Link href='/login'>
            <a className='ml-1 text-blue-500 uppercase'>Entrar</a>
          </Link>
        </small>
      </div>
    </div>
  );
}
