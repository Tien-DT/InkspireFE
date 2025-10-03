import { Outlet, redirect, useLoaderData, useOutletContext } from 'react-router'
import axiosClient from '~/lib/axios'
import { getAccessTokenFromLS } from '~/utils/auth'
import PATH from '~/constants/path'

export type ProtectedContext = {
  accessToken: string
}

export async function clientLoader() {
  const accessToken = getAccessTokenFromLS()
  if (!accessToken) {
    return redirect(PATH.login)
  }

  axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`

  const data: ProtectedContext = { accessToken }
  return data
}

export default function ProtectedLayout() {
  const data = useLoaderData() as ProtectedContext
  return (
    <div>
      <Outlet context={data} />
    </div>
  )
}

export function useProtectedContext() {
  return useOutletContext<ProtectedContext>()
}
