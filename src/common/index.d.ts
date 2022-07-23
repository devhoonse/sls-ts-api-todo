// 클라이언트에게 반환할 본문 양식 정의
interface IResponseBody {
  result: boolean;
  message?: string;
  data?: any;
}

// 할 일 아이템 내용 정의
interface ITodo {
  id: string;
  deletedAt: number | null,   // Date().getTime()
  createdAt: number,          // Date().getTime()
  isCompleted: boolean;
  task: string;
}
