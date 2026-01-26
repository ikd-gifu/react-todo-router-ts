import { useContext } from "react";
import { TodoContext } from "../contexts/TodoContext";

// カスタムフックとしてContextを利用するためのラッパー関数を定義
export const useTodoContext = () =>  useContext(TodoContext);
