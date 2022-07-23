// import : 3rd-parties
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler} from "aws-lambda";

// import : user-defined modules
import HttpStatusCode from "../common/httpStatusCode";
import {response} from "../common/helper";
import {dynamodb, TABLE_TODOS} from "../database/dynamodb";


/*
 * 할 일 목록 조회 요청을 실행하는 핸들러입니다.
 */
export const list: Handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {

  // 요청받은 리소스 내 쿼리 스트링에서 조회 조건 q 값을 읽어들입니다.
  const query = event.queryStringParameters ? event.queryStringParameters.q : null;

  // DynamoDB 에 보낼 목록 조회 조건을 정의합니다.
  const params: DocumentClient.ScanInput = {
    TableName: TABLE_TODOS,
    FilterExpression: "deletedAt = :deletedAt",
    ExpressionAttributeValues: {
      ":deletedAt": null
    }
  };

  // 사용자로부터 요청받은 조회 조건 q 를 조회 조건에 반영합니다.
  if (query) {
    params.FilterExpression += " and contains(task, :query)";
    params.ExpressionAttributeValues = {
      ...params.ExpressionAttributeValues,
      ":query": query,
    };
  }

  // 데이터 목록 조회 요청에 대한 처리를 시작합니다.
  let data: DocumentClient.ScanOutput;
  try {

    // DynamoDB 에서 조건에 맞는 데이터 목록을 조회합니다.
    data = await dynamodb.scan(params).promise();

  } catch (e) {

    // 데이터 목록 조회 중 예기치 못한 에러가 발생한 경우 서버 내부 에러를 응답합니다.
    return response(HttpStatusCode.INTERNAL_SERVER_ERROR, {
      result: false,
      message: e.toString(),
    });
  }

  // 성공적으로 조회가 완료된 경우 응답을 반환합니다.
  return response(HttpStatusCode.OK, {
    result: true,
    data,
  });
};
