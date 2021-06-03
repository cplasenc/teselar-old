import { FormEvent, useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import Axios from 'Axios';
import classNames from 'classnames';
import { useRouter } from 'next/router';

export default function create() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<Partial<any>>({});

  const router = useRouter();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await Axios.post('/subs', { name, title, description})
      
      router.push(`/t/${res.data.name}`)

    } catch (err) {
      console.log(err)
      setErrors(err.response.data)
    }
  }

  return (
    <div className='flex bg-white'>
      <Head>
        <title>Crear comunidad</title>
      </Head>
      <div
        className='w-40 h-screen bg-center bg-cover'
        style={{ backgroundImage: "url('images/main.jpg')" }}
      ></div>
      <div className='flex flex-col justify-center pl-6'>
        <div className='w-98'>
          <h1 className='mb-2 text-lg font-medium'>Crear comunidad</h1>
          <hr />
          <form onSubmit={submitForm}>
              {/** nombre */}
            <div className='my-6'>
              <p className='font-medium'>Nombre</p>
              <p className='mb-2 text-xs text-gray-500'>
                El nombre de la comunidad no puede ser cambiado
              </p>
              <input
                type='text'
                className={classNames(
                  'w-full p-3 border border-gray-200 rounded hover:border-gray-500',
                  { 'border-red-600': errors.name }
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <small className='font-medium text-red-600'>{errors.name}</small>
            </div>
            {/** titulo */}
            <div className='my-6'>
              <p className='font-medium'>Titulo</p>
              <p className='mb-2 text-xs text-gray-500'>
                El titulo de la comunidad define el contenido y puedes cambiarlo en cualquier momento
              </p>
              <input
                type='text'
                className={classNames(
                  'w-full p-3 border border-gray-200 rounded hover:border-gray-500',
                  { 'border-red-600': errors.title }
                )}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <small className='font-medium text-red-600'>{errors.title}</small>
            </div>
            {/** descripcion */}
            <div className='my-6'>
              <p className='font-medium'>Descripción</p>
              <p className='mb-2 text-xs text-gray-500'>
                Explica al mundo tu comunidad
              </p>
              <textarea
                className={classNames(
                  'w-full p-3 border border-gray-200 rounded hover:border-gray-500',
                  { 'border-red-600': errors.description }
                )}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <small className='font-medium text-red-600'>{errors.description}</small>
            </div>
            <div className="flex justify-end">
                <button className="px-4 py-1 text-sm font-semibold capitalize blue button">
                    Crear comunidad
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * Server Side para comprobar si el usuario está logueado
 * si no está logueado no ve esta página (create)
 * @param
 * @returns
 */
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie)
      throw new Error(
        'No se ha encontrado token de autenticación en la cookie'
      );

    await Axios.get('/auth/me', { headers: { cookie } });

    return { props: {} };
  } catch (err) {
    res.writeHead(307, { Location: '/login' }).end();
  }
};
