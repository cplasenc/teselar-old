import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Axios from 'Axios';
import InputGroup from '../components/inputGroup';
import { useRouter } from "next/router";

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const router = useRouter()

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    if(!agreement) {
      setErrors({...errors, agreement: 'Debes aceptar los términos de uso y la política de privacidad'})
      return
    }

    try {
      const res = await Axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        username,
      });

      router.push('/login')

      console.log(res.data); //eliminar
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };

  return (
    <div className='flex'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div
        className='w-40 h-screen bg-center bg-cover'
        style={{ backgroundImage: "url('images/main.jpg')" }}
      ></div>

      <div className='flex flex-col justify-center pl-6'>
        <h1 className='mb-2 text-lg'>Registro de usuario</h1>
        <p className='mb-10 text-xs'>bla bla bla</p>

        <form onSubmit={submitForm}>
          <div className='mb-6'>
            <input
              type='checkbox'
              className='mr-1 cursor-pointer'
              id='agreement'
              checked={agreement}
              onChange={(e) => setAgreement(e.target.checked)}
            />
            <label htmlFor='agreement' className='text-xs cursor-pointer'>
              Acepto los términos de uso y la política de privacidad
            </label>
            <small className='block font-medium text-red-600'>{errors.agreement}</small>
          </div>

          <InputGroup type="email" className='mb-2' value={email} setValue={setEmail} placeholder="EMAIL" error={errors.email} />
          <InputGroup type="text" className='mb-2' value={username} setValue={setUsername} placeholder="NOMBRE DE USUARIO" error={errors.username} />
          <InputGroup type="password" className='mb-4' value={password} setValue={setPassword} placeholder="CONTRASEÑA" error={errors.password} />

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
