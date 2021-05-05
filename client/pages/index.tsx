import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import Axios from 'Axios';
import { Post } from '../types';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';
import useSWR from 'swr';

//convierte la hora de creación de un post en relativa (hace 2 horas)
dayjs.extend(relativeTime);

export default function Home() {
  /*sustituido para usar SWR
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    Axios.get('/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);*/
  const {data: posts} = useSWR('/posts')

  return (
    <Fragment>
      <Head>
        <title>Teselar: bla bla bla</title>
      </Head>
      <div className='container flex pt-4'>
        {/* entradas */}
        <div className='w-160'>
          <h1>Envíos recientes</h1>
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* sidebar */}
      </div>
    </Fragment>
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