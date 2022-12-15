import Input from '@/components/Login/Input'
import * as authService from '@/lib/auth.service'
import { adminAuth } from '@/lib/firebaseAdmin'
import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export interface Inputs {
  email: string
  password: string
}

const Login = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoginButtonDisabled(true)
    try {
      await authService.login(data)
      router.push('/')
    } catch (error: any) {
      setErrorMessage('Incorrect email and/or password')
    }
    setLoginButtonDisabled(false)
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-full md:max-w-xl px-4">
        {/* HEADER */}
        <h1 className="font-display text-5xl tracking-tight text-center">
          LOG IN
        </h1>

        {/* FORM */}
        <form className="mt-16 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && (
            <div className="w-full py-4 bg-red-100 border-stone-300 rounded text-center">
              {errorMessage}
            </div>
          )}
          <Input text="email" register={register} />
          {errors.email && (
            <span className="text-xs">This field is required</span>
          )}

          <Input text="password" register={register} />
          {errors.password && (
            <span className="text-xs">This field is required</span>
          )}

          <button
            className="w-full text-lg py-4 bg-red-600 rounded text-gray-100"
            type="submit"
            disabled={loginButtonDisabled}
          >
            Log in
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-4">
          Don&apos;t have an account?
          <Link href="/signup" legacyBehavior>
            <a className="underline ml-2">Sign up here</a>
          </Link>
        </p>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    // user found in the cookies
    const { token } = nookies.get(ctx)
    await adminAuth.verifyIdToken(token)

    ctx.res.writeHead(302, {
      Location: '/',
    })
    ctx.res.end()
    return { props: {} as never }
  } catch (err) {
    //user not found in the cookies
    return { props: {} as never }
  }
}

export default Login
