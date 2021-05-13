import { Head } from 'next/document';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import useSWR from 'swr';
import PostCard from '../../components/PostCard';
import { Sub } from '../../types';
import Image from 'next/image';

export default function SubPage() {
  const router = useRouter();

  const subName = router.query.sub;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  //si la comunidad no existe, redirigue a inicio
  if (error) router.push('/');

  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className='text-lg text-center'>Cargando...0</p>;
  } else if (sub.posts.length === 0) {
    postsMarkup = (
      <p className='text-lg text-center'>Aún no se ha creado ninguna entrada</p>
    );
  } else {
    postsMarkup = sub.posts.map((post) => (
      <PostCard key={post.id} post={post} />
    ));
  }

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>

      {sub && (
        <Fragment>
          {/* Sub info and images */}
          <div>
            {/* Banner imagen */}
            <div className='bg-blue-500'>
              {sub.bannerUrl ? (
                <div
                  className='h-56 bg-blue-500'
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              ) : (
                <div className='h-20 bg-blue-500'></div>
              )}
            </div>
            {/* Sub meta data*/}
            <div className='h-20 bg-white'>
              <div className='container flex'>
                <Image
                  src={sub.imageUrl}
                  alt='Sub'
                  className='rounded-full'
                  width={80}
                  height={80}
                ></Image>
              </div>
            </div>
          </div>
          {/* Posts y Sidebar */}
          <div className='container flex pt-5'>
            <div className='w-160'></div>
            {postsMarkup}
          </div>
        </Fragment>
      )}
    </div>
  );
}
