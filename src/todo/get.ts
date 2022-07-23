// import : 3rd-parties
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler} from "aws-lambda";

// import : user-defined modules
import HttpStatusCode from "../common/httpStatusCode";
import {response} from "../common/helper";
import {dynamodb, TABLE_TODOS} from "../database/dynamodb";


/*
 * 할 일 조회 요청을 실행하는 핸제러입니다.
 */
export const get: Handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {

  // 요청받은 리소스 내 쿼리 스트링에서 id 값을 읽어들입니다.
  const id = event.pathParameters.id;

  // DynamoDB 에 보낼 조회 조건을 정의합니다.
  const params: DocumentClient.GetItemInput = {
    TableName: TABLE_TODOS,
    Key: { id },
  };

  // 데이터 조회 요청에 대한 처리를 시작합니다.
  let data: DocumentClient.GetItemOutput;
  try {

    // DynamoDB 에서 데이터 1 건을 조회합니다.
    data = await dynamodb.get(params).promise();

  } catch (e) {

    // 데이터 조회 중 예기치 못한 에러가 발생한 경우 서버 내부 에러를 응답합니다.
    return response(HttpStatusCode.INTERNAL_SERVER_ERROR, {
      result: false,
      message: e.toString(),
    });
  }

  // 성공적으로 조회가 완료된 경우 응답을 반환합니다.
  return response(HttpStatusCode.OK, {
    result: !!data.Item,
    message: data.Item ? "Success" : `No Such ID : ${id}`,
    data,
  });
};
