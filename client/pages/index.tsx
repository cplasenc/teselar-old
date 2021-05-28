import Head from 'next/head';
import { Fragment } from 'react';
import { Sub } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';

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
  const { data: posts } = useSWR('/posts');
  const { data: topSubs } = useSWR('/misc/top-subs');

  return (
    <Fragment>
      <Head>
        <title>Teselar: bla bla bla</title>
      </Head>
      <div className='container flex pt-4'>
        {/* entradas */}
        <div className='w-160'>
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* sidebar */}
        <div className='ml-6 w-80'>
          <div className='bg-white rounded'>
            <div className='p-4 border-b-2'>
              <p className='text-lg font-semibold text-center'>
                Comunidades Populares
              </p>
            </div>
            <div>
              {topSubs?.map((sub: Sub) => (
                <div
                  key={sub.name}
                  className='flex items-center px-4 py-2 text-xs border-b'
                >
                  <Link href={`/t/${sub.name}`}>
                    <Image
                      src={sub.imageUrl}
                      className='rounded-full cursor-pointer'
                      alt='Sub'
                      width={(6 * 16) / 4}
                      height={(6 * 16) / 4}
                    />
                  </Link>
                  <Link href={`/t/${sub.name}`}>
                    <a className='ml-2 font-bold hover:cursor-pointer'>
                      /t/{sub.name}
                    </a>
                  </Link>
                  <p className='ml-auto font-med'>{sub.postCount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
