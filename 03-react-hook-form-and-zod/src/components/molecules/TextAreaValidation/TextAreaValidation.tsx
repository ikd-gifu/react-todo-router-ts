import { FC, ComponentProps } from 'react';
import { CommonTextArea } from '../../atoms';
import styles from './style.module.css';

type TextAreaValidationProps = ComponentProps<typeof CommonTextArea> & {
  errorMessage?: string;
};

// propsとしてController由来のfieldのプロパティを受け取る
// エラーメッセージを表示する場合に使用
export const TextAreaValidation: FC<TextAreaValidationProps> = (props) => (
  <>
  <CommonTextArea {...props} />
  {props.errorMessage &&
    (<p className={styles.errorMessage}>{props.errorMessage}</p>)}
  </>
);
