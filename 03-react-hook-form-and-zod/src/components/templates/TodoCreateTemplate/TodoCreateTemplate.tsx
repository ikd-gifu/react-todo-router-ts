import { Controller } from 'react-hook-form';
import { useTodoCreateTemplate } from './useTodoCreateTemplate';
import { CommonTextArea, CommonButton } from '../../atoms';
import { InputFormValidation } from '../../molecules/InputFormValidation/InputFormValidation';
import { BasicLayout } from '../../organisms';
import styles from './style.module.css';

/**
 * Todo新規作成テンプレート
 * titleとcontentの入力フォームを提供
 */
export const TodoCreateTemplate = () => {
  // ページ固有のカスタムフックでフォーム状態を管理
  const {
    control,
    errors,
    handleCreateSubmit,
  } = useTodoCreateTemplate();

  return (
    <BasicLayout title="Todo新規作成">
      <form className={styles.formGroup} onSubmit={handleCreateSubmit}>
        <div className={styles.formGroup}>
          {/* name="title" を内部ストアに紐づけ、field を生成しInputFormValidationに渡す */}
          {/* fieldを用いて、DOMをRHFの内部状態に接続 fieldはController が render に渡す RHF由来のオブジェクト */}
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              // field の中身を別々のpropsとして展開して渡す
              // field は 最初から value / onChange / onBlur / name / ref などを持つ
              <InputFormValidation
                inputValue={field.value}
                placeholder="タイトルを入力"
                handleChangeValue={field.onChange}
                errorMessage={errors.title?.message}
                // InputFormは独自Propsなので、標準input互換のfieldをそのまま渡すと
                // 型が合わないため、必要なPropsのみ展開
                // {...field}
              />
            )}
          />
        </div>

        <div className={styles.formGroup}>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <CommonTextArea
              // undefinedを空文字に変換して渡す
              // CommonTextAreaのProps契約に合わせ、stringを必ず渡すため
                inputValue={field.value ?? ""}
                placeholder="詳細な内容を入力（任意）"
                handleChangeValue={field.onChange}
                rows={5}
              />
            )}
          />
        </div>

        <div className={styles.buttonGroup}>
          <CommonButton type="submit">作成</CommonButton>
        </div>
      </form>
    </BasicLayout>
  );
};
