import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import styles from "./style.module.css";

export const TodoList = ({ todoList, handleDeleteTodo }) => {
  return (
    <div className={styles.container}>
      {todoList.length === 0 ? (
        <p className={styles.emptyMessage}>Todoがありません</p>
      ) : (
        <ul className={styles.list}>
          {todoList.map((todo) => (
            <li key={todo.id} className={styles.todo}>
              <span className={styles.task}>{todo.title}</span>
              {/* svg要素にcssを当てるためにdivで囲む */}
              <div className={styles.far}>
                {/* アロー関数で「クロージャ」を作り、クリック時に実行される関数を登録。引数にTodoのidとtitleを渡す */}
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  onClick={() => handleDeleteTodo(todo.id, todo.title)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
