import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import useSWR from 'swr';
import Sidebar from '../../../components/Sidebar';
import { Post, Sub } from '../../../types';
import Axios from 'Axios'
import { GetServerSideProps } from 'next';

export default function submit() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const router = useRouter();
  const { sub: subName } = router.query;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  if (error) router.push('/'); //si hay algún error redirigue a portada

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') return;

    try {
      const { data: post } = await Axios.post<Post>('/posts', { title: title.trim(), body, sub: sub.name });

      router.push(`/t/${sub.name}/${post.identifier}/${post.slug}`) //te redirigue al post una vez enviado el post
    } catch (err) {
        console.log(err)
    }
  };

  return (
    <div className='container flex pt-5'>
      <Head>
        <title>Enviar</title>
      </Head>
      <div className='w-160'>
        <div className='p-4 bg-white rounded'>
          <h1 className='mb-3 text-lg'>Enviar a /t/{subName}</h1>
          <form onSubmit={submitPost}>
            <div className='relative mb-2'>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none'
                placeholder='Título'
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className='absolute mb-2 text-sm text-gray-500 select-none focus:border-gray-600' style={{ top: 11, right: 10 }}>
                {/** ej: 15/300 */}
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600'
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder='Texto (opcional)'
              rows={4}
            ></textarea>
            <div className='flex justify-end'>
              <button
                className='px-3 py-1 blue button'
                type='submit'
                disabled={title.trim().length === 0}
              >Enviar</button>
            </div>
          </form>
        </div>
      </div>
      {sub && <Sidebar sub={sub} />}
    </div>
  );
}

/**
 * Server Side para comprobar si el usuario está logueado
 * si no está logueado no ve esta página (submit)
 * @param param0 
 * @returns 
 */
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie
    if(!cookie) throw new Error('No se ha encontrado token de autenticación en la cookie')

    await Axios.get('/auth/me', { headers: { cookie }})

    return { props: {} }
  } catch (err) {
    res.writeHead(307, { Location: '/login' }).end()
  }
}