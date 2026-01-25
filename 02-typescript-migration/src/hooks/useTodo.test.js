// // テスト作成は保留
// import { describe, expect, test, vi } from 'vitest'
// import { renderHook, act } from '@testing-library/react'
// import { useTodo } from './useTodo'

// describe("useTodo Hooksのテスト", () => {
//   describe("onChangeAddInputValue関数のテスト", () => {
//     test("【正常系】初期状態が空文字であること", () => {
//       // フックをレンダリング
//       const { result } = renderHook(() => useTodo());
//       // React Hooksは再レンダリングで関数が再生成されるため、result.currentから直接呼ぶ
//       // 参照が古くなるのを防ぐため
//       expect(result.current.addInputValue).toBe("");
//     });

//     // フックをレンダリング
//     // React HooksはReactコンポーネント内でしか呼び出せないルールがあるため
//     test("入力値を正しく更新する", () => {
//       const { result } = renderHook(() => useTodo());
      
//       // イベントオブジェクト(引数)を作成
//       const mockEvent = {
//         target: { value: "新しいTodo" },
//       };
      
//       // 関数を実行して状態を更新
//       // React の状態更新を同期的に完了
//       act(() => {
//         result.current.onChangeAddInputValue(mockEvent);
//       });

//       // 更新後の状態を確認
//       expect(result.current.addInputValue).toBe("新しいTodo");
//     });
//   });

//   describe("handleAddTodo関数のテスト", () => {
//     test("【正常系】Enterキーで新しいTodoが追加されること", () => {
//     // hooks呼び出し
//     const { result } = renderHook(() => useTodo());
    
//     // 初期状態のTodoリストの長さを取得
//     const initialLength = result.current.showTodoList.length;
    
//     // 入力値をセット
//     act(() => {
//       result.current.onChangeAddInputValue({ 
//         target: { value: "新しいTodo" } 
//       });
//     });
    
//     // Todo追加
//     act(() => {
//       result.current.handleAddTodo({
//         target: { value: "新しいTodo" },
//         key: "Enter",
//         nativeEvent: { isComposing: false } // IME変換中でない
//       });
//     });
    
//     // 検証: 追加されたこと
//     expect(result.current.showTodoList).toHaveLength(initialLength + 1);
    
//     // 検証: 最後に追加されたTodoの内容
//     const lastTodo = result.current.showTodoList[initialLength];
//     expect(lastTodo.title).toBe("新しいTodo");
//     expect(lastTodo.id).toBeDefined(); // IDは存在するが値は問わない。ID採番ロジックは対象でないため
    
//     // 検証: 入力値がリセットされた
//     expect(result.current.addInputValue).toBe("");
//     })

//     test("【正常系】Enterキーがない場合は追加されないこと", () => {
//       const { result } = renderHook(() => useTodo());
      
//       const initialLength = result.current.showTodoList.length;
      
//       act(() => {
//         result.current.onChangeAddInputValue({ 
//           target: { value: "テスト" } 
//         });
//       });
      
//       // Enterキーなし
//       act(() => {
//         result.current.handleAddTodo({
//           target: { value: "テスト" },
//           key: ""
//         });
//       });
      
//       // 追加されていないこと
//       expect(result.current.showTodoList).toHaveLength(initialLength);
      
//       // 入力値はそのまま
//       expect(result.current.addInputValue).toBe("テスト");
//     });

//     test("【正常系】入力値が空の場合は追加されないこと", () => {
//       const { result } = renderHook(() => useTodo());
      
//       const initialLength = result.current.showTodoList.length;
      
//       // 空文字で実行
//       act(() => {
//         result.current.handleAddTodo({
//           target: { value: "" },
//           key: "Enter",
//           nativeEvent: { isComposing: false } // IME変換中でない
//         });
//       });
      
//       // 追加されていないこと
//       expect(result.current.showTodoList).toHaveLength(initialLength);
//     });

//     test("【正常系】IME変換中は追加されないこと", () => {
//       const { result } = renderHook(() => useTodo());
      
//       const initialLength = result.current.showTodoList.length;
      
//       // IME変換中
//       act(() => {
//         result.current.onChangeAddInputValue({ 
//           target: { value: "テスト" } 
//         });
//       });
      
//       act(() => {
//         result.current.handleAddTodo({
//           target: { value: "テスト" },
//           key: "Enter",
//           nativeEvent: { isComposing: true } // IME変換中
//         });
//       });
      
//       // 追加されていないこと
//       expect(result.current.showTodoList).toHaveLength(initialLength);
      
//       // 入力値はそのまま
//       expect(result.current.addInputValue).toBe("テスト");
//     });
//   });

//   describe("handleDeleteTodo関数のテスト", () => {
//     test("【正常系】confirmでOKをクリックした場合、todoが削除されること", () => {
//       // window.confirmをモック化（OKをクリック）
//       window.confirm = vi.fn().mockReturnValueOnce(true);

//       const { result } = renderHook(() => useTodo());
      
//       // 削除対象のTodoを取得
//       // INIT_TODO_LISTをインポートしないで済むように、動的に取得する
//       const targetTodo = result.current.showTodoList[0];
      
//       // 期待値：削除対象以外のTodoが残る
//       const expectedList = result.current.showTodoList.filter(
//         todo => todo.id !== targetTodo.id
//       );
      
//       // 削除実行
//       act(() => {
//         result.current.handleDeleteTodo(targetTodo.id, targetTodo.title);
//       });
      
//       // 検証：期待通りのリストになっていること（配列全体を比較）
//       expect(result.current.showTodoList).toEqual(expectedList);
//     });

//     test("【正常系】confirmでキャンセルをクリックした場合、todoが削除されないこと", () => {
//       // window.confirmをモック化（キャンセルをクリック）
//       window.confirm = vi.fn().mockReturnValueOnce(false);

//       const { result } = renderHook(() => useTodo());
      
//       // 削除対象のTodoを取得
//       const targetTodo = result.current.showTodoList[0];
      
//       // 期待値：変更されない（元のリストのコピー）
//       const expectedList = [...result.current.showTodoList];
      
//       // 削除実行（キャンセルされる）
//       act(() => {
//         result.current.handleDeleteTodo(targetTodo.id, targetTodo.title);
//       });
      
//       // 検証：リストが変更されていないこと（配列全体を比較）
//       expect(result.current.showTodoList).toEqual(expectedList);
//     });
//   });

//   describe("setSearchInputValue関数のテスト", () => {
//     test("【正常系】検索ワードで前方一致検索されること", () => { 
//       const { result } = renderHook(() => useTodo());

//       // 初期状態のリストを保存
//       const initialTodos = [...result.current.showTodoList];
      
//       // 検索ワード "React" で検索（前方一致）
//       act(() => {
//         result.current.setSearchInputValue("React");
//       });

//       // 期待値：初期リストから "React" で始まるTodoだけを抽出
//       const expectedList = initialTodos.filter(
//         todo => todo.title.toLowerCase().startsWith("react")
//       );

//       // 検証：1件のみ表示されること（"ReactでTodoアプリを作成する"）
//       expect(result.current.showTodoList).toEqual(expectedList);
//       expect(result.current.showTodoList).toHaveLength(1);
//       expect(result.current.showTodoList[0].title).toBe("ReactでTodoアプリを作成する");
//     });

//     test("【正常系】検索ワードが空の場合は全件表示されること", () => {
//       const { result } = renderHook(() => useTodo());

//       const initialTodos = [...result.current.showTodoList];
      
//       // 空文字で検索
//       act(() => {
//         result.current.setSearchInputValue("");
//       });

//       // 検証：全件表示されること
//       expect(result.current.showTodoList).toEqual(initialTodos);
//       expect(result.current.showTodoList).toHaveLength(4);
//     });
//   });
// });
