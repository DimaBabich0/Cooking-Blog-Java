import { ReactNode } from 'react';
import styles from './Button.module.scss';
import { PlayBtn } from '../../iconComponents';

type CommonProps = {
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
};

// as="button" (по умолчанию)
type AsButton = CommonProps & {
  as?: 'button';
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

// as="a"
type AsAnchor = CommonProps & {
  as: 'a';
  children: ReactNode;
  href: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

// as="input"
type AsInput = Omit<CommonProps, 'showIcon' | 'iconPosition'> & {
  as: 'input';
  value: string;                         // то, что увидит пользователь
  inputType?: 'submit' | 'button' | 'reset';
  onClick?: () => void;
};

type Props = AsButton | AsAnchor | AsInput;

export default function Button(props: Props) {
  const baseClass = [
    styles.btn,
    props.variant ? styles[props.variant] : '',
    props.size ? styles[props.size] : '',
    'showIcon' in props && props.showIcon ? styles.withIcon : '',
    props.disabled ? styles.disabled : '',
    props.className ?? '',
  ].filter(Boolean).join(' ');

  // INPUT --------------------------------------------------------------------
  if (props.as === 'input') {
    const { value, inputType = 'submit', disabled, onClick } = props;
    return (
      <input
        className={baseClass}
        type={inputType}
        value={value}
        disabled={disabled}
        onClick={onClick}
      />
    );
  }

  // ANCHOR -------------------------------------------------------------------
  if (props.as === 'a') {
    const {
      href, target, rel, children, onClick,
      showIcon = false, iconPosition = 'left', disabled,
    } = props;

    const safeRel = target === '_blank'
      ? (rel ? rel : 'noopener noreferrer')
      : rel;

    return (
      <a
        className={baseClass}
        href={disabled ? undefined : href}
        target={target}
        rel={safeRel}
        onClick={(e) => {
          if (disabled) { e.preventDefault(); return; }
          onClick?.(e);
        }}
        role="button"
        aria-disabled={disabled || undefined}
      >
        {showIcon && iconPosition === 'left' && (
          <span className={`${styles.icon} ${styles.left}`}><PlayBtn/></span>
        )}
        <span className={styles.label}>{children}</span>
        {showIcon && iconPosition === 'right' && (
          <span className={`${styles.icon} ${styles.right}`}><PlayBtn/></span>
        )}
      </a>
    );
  }

  // BUTTON (default) ---------------------------------------------------------
  {
    const {
      children, onClick, type = 'button',
      showIcon = false, iconPosition = 'left', disabled,
    } = props as AsButton;

    return (
      <button
        className={baseClass}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {showIcon && iconPosition === 'left' && (
          <span className={`${styles.icon} ${styles.left}`}><PlayBtn/></span>
        )}
        <span className={styles.label}>{children}</span>
        {showIcon && iconPosition === 'right' && (
          <span className={`${styles.icon} ${styles.right}`}><PlayBtn/></span>
        )}
      </button>
    );
  }
}
