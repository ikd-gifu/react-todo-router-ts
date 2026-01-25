// InputForm を新規作成、検索に使う（再利用）
// Atomic Design の原則（Atoms は純粋なUI）
// 状態を親で一元管理
import styles from "./style.module.css";

export const InputForm = ({
  inputValue,
  placeholder,
  handleChangeValue,
  handleKeyDown,
  disabled = false,
}) => (
  <input
    className={styles.input}
    type="text"
    placeholder={placeholder}
    value={inputValue}
    onChange={handleChangeValue}
    onKeyDown={handleKeyDown}
    disabled={disabled}
  />
);
