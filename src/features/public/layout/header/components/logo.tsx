import Icon from '@/components/icon'
import { Link } from 'src/i18n/router/link'

export const PublicHeaderLogo = () => {
  return (
    <div className="relative z-42 h-[57px] w-[244px] translate-y-[-1px]">
      <Link to="/$lang" aria-label="Guide of Dubai ana sayfası">
        <LogoWrapper />
        <Icon
          name="brand/full-white"
          width={89}
          height={39}
          className="absolute top-[50%] translate-x-[40%] translate-y-[-50%] md:left-[50%] md:translate-x-[-50%]"
        />
      </Link>
    </div>
  )
}

const LogoWrapper = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="203"
        height="57"
        viewBox="0 0 203 57"
        fill="none"
        className="text-primary-500 md:hidden"
      >
        <path
          d="M203 0.768658C180.67 0.768658 169.034 57 146.704 57H-1C-1 57 -1 14.6434 -1 0.000130373L203 0.768658Z"
          fill="currentColor"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="244"
        height="57"
        viewBox="0 0 244 57"
        fill="none"
        className="hidden text-primary-500 md:block"
      >
        <path
          d="M244 0C221.618 0 209.954 57 187.572 57H56.4278C34.0458 57 22.3819 0 0 0H244Z"
          fill="currentColor"
        />
      </svg>
    </>
  )
}
