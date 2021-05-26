//pagina de un post concreto
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Post, Comment } from '../../../../types';
import Image from 'next/image';
import Sidebar from '../../../../components/Sidebar';
import Axios from 'Axios';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useAuthState } from '../../../../context/auth';
import ActionButton from '../../../../components/ActionButtons';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function PostPage() {
  //Local state

  //Global state
  const { authenticated, user } = useAuthState();

  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  const { data: comments, revalidate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  if (error) router.push('/'); //redirigue a inicio si no existe el post

  const vote = async (value: number, comment?: Comment) => {
    //si votas y no estas autentificado redirigue a login
    if (!authenticated) router.push('/login');

    //si el vote es el mismo resetea el voto
    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    )
      value = 0;

    try {
      await Axios.post('/misc/vote', {
        identifier: post.identifier,
        slug: post.slug,
        commentIdentifier: comment?.identifier,
        value: value,
      });

      revalidate() //actualiza automaticamente la UI al votar
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
              <>
                <div className='flex'>
                  {/* votos */}
                  <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'>
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
                  <div className='py-2 pr-2'>
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
                {/** Caja de comentarios */}
                <div className='pl-10 pr-6 mb-4'>
                  {authenticated ? (
                    <div>
                      <p className='mb-1 text-xs'>
                        Comentar como <Link href={`/u/${user.username}`}>
                          <a className='font-semibold text-blue-500'>{user.username}</a>
                        </Link>
                        </p>
                    </div>
                  ) : <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                    <p className='font-semibold text-gray-500'>Inicia sesión para comentar</p>
                    <div>
                      <Link href='/login'>
                        <a className='px-4 py-1 mr-4 hollow blue button'>Iniciar sesión</a>
                      </Link>
                      <Link href='/register'>
                        <a className='px-4 py-1 blue button'>Registrarme</a>
                      </Link>
                    </div>
                  </div> }
                </div>
                <hr />
                {comments?.map((comment) => (
                  <div className='flex' key={comment.identifier}>
                    {/** Votos */}
                    <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'>
                      {/* upvote - voto positivo */}
                      <div
                        className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
                        onClick={() => vote(1, comment)}
                      >
                        <i
                          className={classNames('fas fa-arrow-up', {
                            'text-red-500': comment.userVote === 1,
                          })}
                        ></i>
                      </div>
                      <p className='text-xs font-bold'>{comment.voteScore}</p>
                      {/* downvote - voto negativo */}
                      <div
                        className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
                        onClick={() => vote(-1, comment)}
                      >
                        <i
                          className={classNames('fas fa-arrow-down', {
                            'text-blue-600': comment.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className='mr-1 font-bold hover:underline'>{comment.username}</a>
                        </Link>
                        <span className='text-gray-600'>
                          {`
                          ${comment.voteScore}
                          puntos •
                          ${dayjs(comment.createdAt).fromNow()}
                          `}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}
