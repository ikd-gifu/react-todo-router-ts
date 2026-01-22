// 単一責任	Template = ロジック・状態管理、Organisms = レイアウト、Atoms: 純粋なUI部品
// Container/Presentational パターンとも呼ばれる
import styles from "./style.module.css";
import { BasicLayout, TodoList } from "../../organisms/";
import { InputForm } from "../../atoms";
import { useTodoTemplate } from "./useTodoTemplate";

// ページ固有のUI状態を管理
// 検索機能など、表示に関わる一時的な状態
export const TodoTemplate = () => {
  // ページ固有のカスタムフックでUI状態を管理
  const {
    searchInputValue,
    setSearchInputValue,
    showTodoList,
    handleDeleteTodo,
  } = useTodoTemplate();

  return (
    <BasicLayout title="Todo アプリ">
      {/* Todo検索フォームエリア */}
      <section className={styles.common}>
        <InputForm
          inputValue={searchInputValue}
          placeholder="TODOを検索"
          handleChangeValue={(e) => setSearchInputValue(e.target.value)}
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
