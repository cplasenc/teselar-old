import Head from 'next/head';
import { useEffect, useState } from 'react';
import Axios from 'Axios';
import { Post } from '../types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    Axios.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
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
          {posts.map(post => (
            <div key={post.identifier} className='flex mb-4 bg-white rounded'>
              {/* Votos */}
              <div className="w-10 text-center bg-gray-200 rounded-l">
                <p>V</p>
              </div>
              {/* Post */}
              <div className='w-full p-2'>
                <p>{post.body}</p>
              </div>
            </div>
          ))}
        </div>
        {/* sidebar */}
      </div>
    </div>
  );
}
