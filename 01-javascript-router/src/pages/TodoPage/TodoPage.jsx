import { TodoTemplate } from "../../components/templates";
import { TodoProvider } from "../../contexts/TodoContext";

// TodoProviderでTodoTemplateをラップしてContextを提供
// どこからでもContextの値にアクセス可能にする
export const TodoPage = () => (
  <TodoProvider>
    <TodoTemplate />
  </TodoProvider>
);

// コンポーネントの中身を実装
// index.js と分けるBarrel Export パターン
