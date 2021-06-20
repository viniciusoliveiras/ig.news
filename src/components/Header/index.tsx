import { useRouter } from 'next/router';
import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../ActiveLink/index';

import styles from './styles.module.scss';

export function Header() {


  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src='/images/logo.svg' alt='ig.news logo' />
        <nav>
          <ActiveLink activeClassName={styles.active} href='/'>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href='/posts' prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
