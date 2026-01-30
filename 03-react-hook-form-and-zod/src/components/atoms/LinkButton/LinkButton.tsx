// LinkButton を新規作成、ナビゲーション用のボタンコンポーネント
// Atomic Design の原則（Atoms は純粋なUI）
import { useNavigate } from 'react-router';
import styles from "./style.module.css";
import { FC, ReactNode } from "react";

type LinkButtonProps = {
  children: ReactNode;
  to: string;
};

/**
 * リンクボタンコンポーネント
 * Atomic Designのatoms層 - 状態を持たず、純粋なUIとして実装
 */
export const LinkButton: FC<LinkButtonProps> = ({ children, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button 
      className={styles.linkButton}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
