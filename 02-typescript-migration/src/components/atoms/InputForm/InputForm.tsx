// InputForm を新規作成、検索に使う（再利用）
// Atomic Design の原則（Atoms は純粋なUI）
// 状態を親で一元管理
import styles from "./style.module.css";
import { FC, ChangeEvent, KeyboardEvent } from "react";

// 移行する手間がかかるので、今回は使わない
// type InputFormProps = ComponentProps<"input">;

type InputFormProps = {
  inputValue: string;
  placeholder: string;
  handleChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export const InputForm: FC<InputFormProps> = ({
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
