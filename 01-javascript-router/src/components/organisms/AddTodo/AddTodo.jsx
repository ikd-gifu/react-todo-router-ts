// TodoTemplateにInputFormを橋渡しする役割（propsの受け渡しのみ）
import { InputForm } from "../../atoms";
import styles from "./style.module.css";

// TodoTemplateから({})で指定した名称でPropsを受け取る
export const AddTodo = ({ addInputValue, onChangeTodo, handleAddTodo }) => (
  <div className={styles.container}>
    <h2 className={styles.subTitle}>TODO 追加</h2>
    <InputForm
      inputValue={addInputValue}
      placeholder="新しいTODOを入力してください"
      handleChangeValue={onChangeTodo}
      handleKeyDown={handleAddTodo}
    />
  </div>
);
