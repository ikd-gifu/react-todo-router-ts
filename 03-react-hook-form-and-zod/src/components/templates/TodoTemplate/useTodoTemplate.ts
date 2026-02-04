import { useMemo } from "react";
import { useTodoContext } from "../../../hooks/useTodoContext";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
// import { TodoType } from "../../../types/Todo"; --- 型推論が機能しているため不要

// defaultValuesで""を使うため、string型で定義 optionalは不要
// react-hook-formはフィールド名で値を紐づけるため、
// schemaのキーはdefaultValues・Controllerのnameは
// 同じキー（search）で揃える必要がある
const SearchFormSchema = z.object({
  search: z.string(),
});

type SearchFormFormValue = z.infer<typeof SearchFormSchema>;

/**
 * TodoTemplateのページ固有UI状態管理
 * 検索機能など、表示・操作に関わる一時的な状態を管理
 * ページを離れたら破棄される状態のみを扱う
 */
export const useTodoTemplate = () => {
  // 型推論が機能: originalTodoListがArray<TodoType>と正しく推論される
  const { originalTodoList, handleDeleteTodo } = useTodoContext();

  const {
    control,
  } = useForm<SearchFormFormValue>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  const searchInputValue = useWatch({ control, name: "search" }) ?? "";

  // 検索キーワードに基づいて表示するTodoリストを絞り込む
  // useMemoで派生状態を最適化
  const showTodoList = useMemo(() => {
    return originalTodoList.filter((todo) =>
      // 検索キーワードに前方一致したTodoだけを一覧表示
      todo.title.toLowerCase().startsWith(searchInputValue.toLowerCase())
    );
    // originalTodoListかsearchInputValueが変化したときに再計算
  }, [originalTodoList, searchInputValue]);

  return {
    control,
    showTodoList,
    handleDeleteTodo,
  };
};
