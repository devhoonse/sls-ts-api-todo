// import : 3rd-parties
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler} from "aws-lambda";

// import : user-defined modules
import HttpStatusCode from "../common/httpStatusCode";
import {response} from "../common/helper";
import {dynamodb, TABLE_TODOS} from "../database/dynamodb";


/*
 * 할 일 수정 요청을 실행하는 핸들러입니다.
 */
export const update: Handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {

  // 요청받은 본문을 읽어들입니다.
  const input = JSON.parse(event.body);

  // DynamoDB 에 보낼 수정 조건을 정의합니다.
  const params: DocumentClient.UpdateItemInput = {
    TableName: TABLE_TODOS,
    Key: { id: input.id },
  };

  // DynamoDB 로 전송할 데이터 수정 요청 본문을 작성합니다.
  const expressions: Array<string> = [];
  const values: any = {};
  for (let key in input.updates) {
    expressions.push(`${key} = :${key}`);
    values[`:${key}`] = input.updates[key];
  }
  const exp = `SET ${expressions.join(", ")}`;
  params.UpdateExpression = exp;
  params.ExpressionAttributeValues = values;

  // 데이터 수정 요청에 대한 처리를 시작합니다.
  let data: DocumentClient.GetItemOutput;
  try {

    // DynamoDB 에서 데이터 1 건을 수정합니다.
    data = await dynamodb.update(params).promise();

  } catch (e) {

    // 데이터 수정 중 예기치 못한 에러가 발생한 경우 서버 내부 에러를 응답합니다.
    return response(HttpStatusCode.INTERNAL_SERVER_ERROR, {
      result: false,
      message: e.toString(),
    });
  }

  // 성공적으로 수정이 완료된 경우 응답을 반환합니다.
  return response(HttpStatusCode.OK, {
    result: true,
    message: "Success",
    data,
  });

};
