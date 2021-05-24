//pagina de un post concreto
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Post } from '../../../../types';
import Image from 'next/image';
import Sidebar from '../../../../components/Sidebar';
import Axios from 'Axios';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useAuthState } from '../../../../context/auth';
import ActionButton from '../../../../components/ActionButtons';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

export default function PostPage() {
  //Local state

  //Global state
  const { authenticated } = useAuthState();

  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );
  if (error) router.push('/'); //redirigue a inicio si no existe el post

  const vote = async (value: number) => {
    //si votas y no estas autentificado redirigue a login
    if (!authenticated) router.push('/login');

    //si el vote es el mismo resetea el voto
    if (value === post.userVote) value = 0;

    try {
      const res = await Axios.post('/misc/vote', {
        identifier: post.identifier,
        slug: post.slug,
        value: value,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className='flex items-center w-full h-20 p-8 bg-blue-500'>
            <div className='container flex'>
              {post && (
                <div className='w-8 h-8 mr-2 overflow-hidden rounded-full'>
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  ></Image>
                </div>
              )}
              <p className='text-xl font-semibold text-white'>/t/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className='container flex pt-5'>
        {/* Post */}
        <div className='w-160'>
          <div className='bg-white rounded'>
            {post && (
              <div className='flex'>
                {/* votos */}
                <div className='w-10 py-3 text-center rounded-l'>
                  {/* upvote - voto positivo */}
                  <div
                    className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
                    onClick={() => vote(1)}
                  >
                    <i
                      className={classNames('fas fa-arrow-up', {
                        'text-red-500': post.userVote === 1,
                      })}
                    ></i>
                  </div>
                  <p className='text-xs font-bold'>{post.voteScore}</p>
                  {/* downvote - voto negativo */}
                  <div
                    className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
                    onClick={() => vote(-1)}
                  >
                    <i
                      className={classNames('fas fa-arrow-down', {
                        'text-blue-600': post.userVote === -1,
                      })}
                    ></i>
                  </div>
                </div>
                <div className='p-2'>
                  <div className='flex items-center'>
                    <p className='text-xs text-gray-500'>
                      Enviado por
                      <Link href={`/u/${post.username}`}>
                        <a className='mx-1 hover:underline'>
                          /u/{post.username}
                        </a>
                      </Link>
                      <Link href={post.url}>
                        <a className='mx-1 hover:underline'>
                          {dayjs(post.createdAt).fromNow()}
                        </a>
                      </Link>
                    </p>
                  </div>
                  {/* Post titulo */}
                  <h1 className='my-1 text-xl font-medium'>{post.title}</h1>
                  {/* Post body */}
                  <p className='my-3 text-sm'>{post.body}</p>
                  {/* Botones de acción */}
                  <div className='flex'>
                    <Link href={post.url}>
                      <a>
                        {/* comentarios*/}
                        <ActionButton>
                          <i className='mr-1 fas fa-comments fa-xs'></i>
                          <span className='font-bold'>
                            {post.commentCount} comentarios
                          </span>
                        </ActionButton>
                      </a>
                    </Link>
                    {/* compartir*/}
                    <ActionButton>
                      <i className='mr-1 fas fa-share fa-xs'></i>
                      <span className='font-bold'>Compartir</span>
                    </ActionButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}
