// CommonTextArea を新規作成、詳細入力・表示に使う（再利用）
// Atomic Design の原則（Atoms は純粋なUI）
// 状態を親で一元管理
import styles from "./style.module.css";
import { FC, ChangeEvent } from "react";

type CommonTextAreaProps = {
  // 制御コンポーネントなので、valueを常にstringで受け取る
  // undefined許容: valueが渡らない可能性 → 非制御コンポーネントになるため避ける
  inputValue: string;
  placeholder: string;
  handleChangeValue?: (e: ChangeEvent<HTMLTextAreaElement>) => void; // TodoDetailTemplateでの使用を考慮しオプショナルに
  // 任意の設定なので、?で問題ない
  rows?: number;
  disabled?: boolean;
};

/**
 * テキストエリアコンポーネント
 * Atomic Designのatoms層 - 状態を持たず、純粋なUIとして実装
 */
export const CommonTextArea: FC<CommonTextAreaProps> = ({
  inputValue,
  placeholder,
  handleChangeValue,
  rows = 5,
  disabled = false,
}) => (
  <textarea
    className={styles.textarea}
    placeholder={placeholder}
    value={inputValue}
    onChange={handleChangeValue}
    rows={rows}
    disabled={disabled}
  />
);
