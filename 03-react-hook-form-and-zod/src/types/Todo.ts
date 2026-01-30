// データ構造（DTO/Model）なのでtypeで定義
// グローバルに影響を与えないようにexport付きで定義
export type TodoType = {
  id: number;
  title: string;
  content: string;
}
