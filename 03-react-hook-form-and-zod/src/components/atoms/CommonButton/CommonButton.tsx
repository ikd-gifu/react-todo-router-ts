// CommonButton を新規作成、再利用可能なボタンコンポーネント
// Atomic Design の原則（Atoms は純粋なUI）
// 状態を親で一元管理
import styles from "./style.module.css";
import { FC, ReactNode, ComponentProps } from "react";

// HTMLボタンの標準Props（disabled, type, onClickなど）を網羅
// type="submit"でもonClick必須にならないようにする
type CommonButtonProps = ComponentProps<"button"> & {
  children: ReactNode;
};

/**
 * 共通ボタンコンポーネント
 * Atomic Designのatoms層 - 状態を持たず、純粋なUIとして実装
 */
// 標準button互換に拡張し、typeを受け取れるようにする
export const CommonButton: FC<CommonButtonProps> = ({
  children,
  onClick,
  type = "button"
}) => {
  return (
    <button 
      className={styles.button}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
