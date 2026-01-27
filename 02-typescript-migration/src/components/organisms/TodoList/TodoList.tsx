import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faFile } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { NAV_ITEMS } from "../../../constants/navigation";

import styles from "./style.module.css";
import { FC } from "react";

type TodoListProps = {
  // 表示用のpropsのみ型を定義する
  todoList: {id: number; title: string;}[];
  handleDeleteTodo: (id: number, title: string) => void;
};

export const TodoList: FC<TodoListProps> = ({ todoList, handleDeleteTodo }) => {
  const navigate = useNavigate();

  /**
   * 詳細ページへの遷移処理
   */
  const handleNavigateToDetail = (id: number) => {
    navigate(`${NAV_ITEMS.DETAIL}${id}`);
  };

  /**
   * 編集ページへの遷移処理
   */
  const handleNavigateToEdit = (id: number) => {
    navigate(`${NAV_ITEMS.EDIT}${id}`);
  };

  return (
    <div className={styles.container}>
      {todoList.length === 0 ? (
        <p className={styles.emptyMessage}>Todoがありません</p>
      ) : (
        <ul className={styles.list}>
          {todoList.map((todo) => (
            <li key={todo.id} className={styles.todo}>
              <span className={styles.task}>{todo.title}</span>
              {/* アイコングループ */}
              <div className={styles.iconGroup}>
                {/* 詳細アイコン */}
                <FontAwesomeIcon
                  icon={faFile}
                  className={styles.icon}
                  onClick={() => handleNavigateToDetail(todo.id)}
                />
                {/* 編集アイコン */}
                <FontAwesomeIcon
                  icon={faEdit}
                  className={styles.icon}
                  onClick={() => handleNavigateToEdit(todo.id)}
                />
                {/* 削除アイコン */}
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className={styles.icon}
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
