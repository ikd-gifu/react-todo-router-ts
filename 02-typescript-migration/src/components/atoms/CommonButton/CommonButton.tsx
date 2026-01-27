// CommonButton を新規作成、再利用可能なボタンコンポーネント
// Atomic Design の原則（Atoms は純粋なUI）
// 状態を親で一元管理
import styles from "./style.module.css";
import { FC, ReactNode, MouseEvent } from "react";

type CommonButtonProps = {
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

/**
 * 共通ボタンコンポーネント
 * Atomic Designのatoms層 - 状態を持たず、純粋なUIとして実装
 */
export const CommonButton: FC<CommonButtonProps> = ({ children, onClick }) => {
  return (
    <button 
      className={styles.button}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
