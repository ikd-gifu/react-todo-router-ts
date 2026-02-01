// データ構造（DTO/Model）なのでtypeで定義
// グローバルに影響を与えないようにexport付きで定義
export type TodoType = {
  id: number;
  title: string;
  // content?: stringにすると、今度は読み取り側（詳細/編集/表示など）で
  // contentがundefinedになる可能性が増えてしまうため、ここでは必須にする
  content: string;
}
