import { ReactNode } from 'react'
import styles from './Button.module.scss'
import { PlayBtn } from '../../iconComponents'

type Props = {
  children: ReactNode
  onClick?: () => void
  showIcon?: boolean          // показывать ли иконку
  iconPosition?: 'left' | 'right'
}

export default function Button({
  children,
  onClick,
  showIcon = false,
  iconPosition = 'left',
}: Props) {
  return (
    <button
      className={`${styles.btn} ${showIcon ? styles.withIcon : ''}`}
      onClick={onClick}
    >
      {showIcon && iconPosition === 'left' && (
        <span className={`${styles.icon} ${styles.left}`}>
          <PlayBtn/>
        </span>
      )}

      <span className={styles.label}>{children}</span>

      {showIcon && iconPosition === 'right' && (
        <span className={`${styles.icon} ${styles.right}`}>
          <PlayBtn/>
        </span>
      )}
    </button>
  )
}
