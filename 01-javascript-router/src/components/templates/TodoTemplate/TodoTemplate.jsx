// 単一責任	Template = ロジック・状態管理、Organisms = レイアウト、Atoms: 純粋なUI部品
// Container/Presentational パターンとも呼ばれる
import styles from "./style.module.css";
import { BasicLayout, TodoList } from "../../organisms/";
import { InputForm } from "../../atoms";
import { useTodoContext } from "../../../hooks/useTodoContext";

// 全ての状態を管理
// originTodoListは複数のコンポーネントで使われる
// → 親（TodoTemplate）で管理する
export const TodoTemplate = () => {
  // カスタムフックuseTodoを使って状態管理を分離
  const {
    showTodoList, // 状態
    searchInputValue,
    handleDeleteTodo, // 関数
    setSearchInputValue
  } = useTodoContext();

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
