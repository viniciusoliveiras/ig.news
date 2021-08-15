import { ActiveLink } from '../ActiveLink/index';
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img
          src="/images/logo.svg"
          alt="ig.news logo"
          className={styles.logoDesktop}
        />

        <img
          src="/reactjs-line.svg"
          alt="ig.news logo"
          className={styles.logoMobile}
        />

        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
