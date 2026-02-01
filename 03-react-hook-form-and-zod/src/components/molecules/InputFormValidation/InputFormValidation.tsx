// InputFormは純粋UIのままにし、エラー表示をMoleculeに分離する
import { FC, ComponentProps } from 'react';
import { InputForm } from '../../atoms';
import styles from './style.module.css';

// ComponentPropsを使い、React が持つ input の型定義をそのまま参照
// ComponentProps<"input">は使えない。InputFormにはinputValueが必須になるため
// InputFormをコンポーネントから呼び出す形に変更
type InputFormValidationProps = ComponentProps<typeof InputForm> & {
  errorMessage?: string;
};

export const InputFormValidation: FC<InputFormValidationProps> = (props) => (
  // FC の戻り値は ReactElement | null なので、void ではなく JSX を返している
  // propsにhandleChangeValueを含む
  <>
    <InputForm {...props} />
    {props.errorMessage && (
      <p className={styles.errorMessage}>{props.errorMessage}</p>
    )}
  </>
);
