// import : 3rd-parties
import { v4 as uuidV4 } from "uuid";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler} from "aws-lambda";

// import : user-defined modules
import HttpStatusCode from "../common/httpStatusCode";
import {response} from "../common/helper";
import {dynamodb, TABLE_TODOS} from "../database/dynamodb";


/*
 * 신규 할 일 적재 요청을 실행하는 핸들러입니다.
 */
export const add: Handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {

  // 요청받은 본문을 읽어들입니다.
  const input = JSON.parse(event.body);

  // 현재 실행 시점 Timestamp 를 확인합니다.
  const now = new Date();

  // 적재할 데이터 본문을 만듭니다.
  const data: ITodo = {
    id: uuidV4(),
    deletedAt: null,
    createdAt: now.getTime(),
    isCompleted: false,
    task: input.task,
  };

  // 데이터 적재 요청에 대한 처리를 시작합니다.
  try {

    // DynamoDB 에 데이터 1 건을 적재합니다.
    await dynamodb.put({
      TableName: TABLE_TODOS,
      Item: data,
    }).promise();

  } catch (e) {

    // 데이터 적재 중 예기치 못한 에러가 발생한 경우 서버 내부 에러를 응답합니다.
    return response(HttpStatusCode.INTERNAL_SERVER_ERROR, {
      result: false,
      message: e.toString(),
    });
  }

  // 성공적으로 적재가 완료된 경우 응답을 반환합니다.
  return response(HttpStatusCode.OK, {
    result: true,
    message: "Insert Success",
    data,
  });
};
