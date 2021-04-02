import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Axios from 'Axios';
import InputGroup from '../components/inputGroup';
import { useRouter } from 'next/router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await Axios.post('http://localhost:5000/api/auth/login', {
        password,
        username,
      });

      router.push('/'); //redirigue a la página de inicio al hacer login
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };

  return (
    <div className='flex'>
      <Head>
        <title>Iniciar sesión</title>
      </Head>

      <div
        className='w-40 h-screen bg-center bg-cover'
        style={{ backgroundImage: "url('images/main.jpg')" }}
      ></div>

      <div className='flex flex-col justify-center pl-6'>
        <h1 className='mb-2 text-lg'>Registro de usuario</h1>
        <p className='mb-10 text-xs'>bla bla bla</p>

        <form onSubmit={submitForm}>
          <InputGroup
            type='text'
            className='mb-2'
            value={username}
            setValue={setUsername}
            placeholder='NOMBRE DE USUARIO'
            error={errors.username}
          />
          <InputGroup
            type='password'
            className='mb-4'
            value={password}
            setValue={setPassword}
            placeholder='CONTRASEÑA'
            error={errors.password}
          />

          <button className='w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded'>
            Iniciar sesión
          </button>
        </form>
        <small>
          ¿No tienes cuenta?
          <Link href='/register'>
            <a className='ml-1 text-blue-500 uppercase'>Registrarme</a>
          </Link>
        </small>
      </div>
    </div>
  );
}
