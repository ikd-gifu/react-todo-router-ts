// CommonTextArea を新規作成、詳細入力・表示に使う（再利用）
// Atomic Design の原則（Atoms は純粋なUI）
// 状態を親で一元管理
import styles from "./style.module.css";

/**
 * テキストエリアコンポーネント
 * Atomic Designのatoms層 - 状態を持たず、純粋なUIとして実装
 */
export const CommonTextArea = ({
  inputValue,
  placeholder,
  handleChangeValue,
  rows = 5,
}) => (
  <textarea
    className={styles.textarea}
    placeholder={placeholder}
    value={inputValue}
    onChange={handleChangeValue}
    rows={rows}
  />
);
