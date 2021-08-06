import { useGlobSetting } from '@/hooks/useGlobSettings'

const { title } = useGlobSetting()

export default function setPageTitle(routeTitle: string, t) {
  return routeTitle ? `${t(routeTitle)} - ${title}` : `${title}`
}
