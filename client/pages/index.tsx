import Head from 'next/head';
import { Fragment } from 'react';
import { Post, Sub } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthState } from '../context/auth';

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
  const { data: posts } = useSWR<Post[]>('/posts');
  const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs');

  const { authenticated } = useAuthState()

  return (
    <Fragment>
      <Head>
        <title>Teselar: bla bla bla</title>
      </Head>
      <div className='container flex pt-4'>
        {/* entradas */}
        <div className='w-full px-4 md:w-160 md:p-0'>
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* sidebar */}
        <div className='hidden ml-6 md:block w-80'>
          <div className='bg-white rounded'>
            <div className='p-4 border-b-2'>
              <p className='text-lg font-semibold text-center'>
                Comunidades Populares
              </p>
            </div>
            <div>
              {topSubs?.map((sub) => (
                <div
                  key={sub.name}
                  className='flex items-center px-4 py-2 text-xs border-b'
                >
                  <Link href={`/t/${sub.name}`}>
                    <a>
                    <Image
                      src={sub.imageUrl}
                      className='rounded-full cursor-pointer'
                      alt='Sub'
                      width={(6 * 16) / 4}
                      height={(6 * 16) / 4}
                    />
                    </a>
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
            {authenticated && (
            <div className="p-4 b-t-2">
              <Link href="/subs/create">
                <a className='w-full px-2 blue button'>
                  Crear comunidad
                </a>
              </Link>
            </div>

            )}
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
