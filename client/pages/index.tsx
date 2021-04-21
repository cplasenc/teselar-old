import Head from 'next/head';
import { useEffect, useState } from 'react';
import Axios from 'Axios';
import { Post } from '../types';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//convierte la hora de creación de un post en relativa (hace 2 horas)
dayjs.extend(relativeTime);

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    Axios.get('/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className='pt-12'>
      <Head>
        <title>Teselar: bla bla bla</title>
      </Head>
      <div className='container flex pt-4'>
        {/* entradas */}
        <div className='w-160'>
          <h1>Envíos recientes</h1>
          {posts.map((post) => (
            <div key={post.identifier} className='flex mb-4 bg-white rounded'>
              {/* Votos */}
              <div className='w-10 text-center bg-gray-200 rounded-l'>
                <p>V</p>
              </div>
              {/* Post */}
              <div className='w-full p-2'>
                <div className='flex items-center'>
                  <Link href={`/r/${post.subName}`}>
                    <img
                      src='#'
                      className='w-6 h-6 mr-1 rounded-full cursor-pointer'
                    />
                  </Link>
                  <Link href={`/r/${post.subName}`}>
                    <a className='text-xs font-bold hover:underline'>
                      /t/{post.subName}
                    </a>
                  </Link>
                  <p className='text-xs text-gray-500'>
                    <span className='mx-1'>•</span>
                    Enviado por
                    <Link href={`/u/${post.username}`}>
                      <a className='mx-1 hover:underline'>/u/{post.username}</a>
                    </Link>
                    <Link href={post.url}>
                      <a className='mx-1 hover:underline'>
                        {dayjs(post.createdAt).fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                <Link href={post.url}>
                  <a className='my-1 text-lg font-medium'>{post.title}</a>
                </Link>
                {post.body && <p className='my-1 text-sm'>{post.body}</p>}
                <div className='flex'>
                  <Link href={post.url}>
                    <a>
                      {/* comentarios*/}
                      <div className='px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                        <i className='mr-1 fas fa-comments fa-xs'></i>
                        <span className='font-bold'>20 comentarios</span>
                      </div>
                    </a>
                  </Link>
                  {/* compartir*/}
                  <div className='px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                    <i className='mr-1 fas fa-share fa-xs'></i>
                    <span className='font-bold'>Compartir</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* sidebar */}
      </div>
    </div>
  );
}



/* //Server side rendering (opcional)
//Ahora hace client side rendering
export const getServerSideProps = async (context) => {
  try {
    const res = await Axios.get('/posts')

    return { props: { posts: res.data }}
  } catch (err) {
    return { props: { error: 'Error inesperado'}}
  }

}
 */