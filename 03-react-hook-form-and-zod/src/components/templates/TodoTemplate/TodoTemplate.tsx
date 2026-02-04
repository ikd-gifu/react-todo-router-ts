// 単一責任	Template = UI組み立て、カスタムフック = ロジック・状態管理、Organisms = レイアウト、Atoms: 純粋なUI部品
// Container/Presentational パターンとも呼ばれる
import styles from "./style.module.css";
import { BasicLayout, TodoList } from "../../organisms/";
import { InputFormValidation } from "../../molecules";
import { useTodoTemplate } from "./useTodoTemplate";
import { Controller } from "react-hook-form";

/**
 * TodoTemplate
 * Todo一覧ページのテンプレートコンポーネント
 * 検索機能とTodoリスト表示を提供
 */
export const TodoTemplate = () => {
  // ページ固有のカスタムフックでUI状態とロジックを管理
  const {
    control,
    showTodoList,
    handleDeleteTodo,
  } = useTodoTemplate();

  return (
    <BasicLayout title="Todo アプリ">
      {/* Todo検索フォームエリア */}
      <section className={styles.common}>
        <Controller
          control={control}
          name="search"
          render={({ field }) => (
            <InputFormValidation
              inputValue={field.value ?? ""}
              placeholder="TODOを検索"
              handleChangeValue={field.onChange}
            />
          )}
        />
      </section>
      {/* Todoリスト一覧表示 */}
      <section className={styles.common}>
        {/* 状態、関数を渡す */}
        <TodoList
          todoList={showTodoList}
          handleDeleteTodo={handleDeleteTodo}
        />
      </section>
    </BasicLayout>
  );
};
