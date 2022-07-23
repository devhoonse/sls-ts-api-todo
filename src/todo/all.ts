// import : 3rd-parties
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

// import : user-defined modules
import { response } from "../common/helper";
import { dynamodb, TABLE_TODOS } from "../database/dynamodb";
import HttpStatusCode from "../common/httpStatusCode";


/*
 * TABLE_TODOS 를 스캔하여 모든 데이터들을 응답합니다.
 */
export const all: Handler = async (
  _event: APIGatewayProxyEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> => {

  // 할 일 목록 조회 요청을 시작합니다.
  let data: DocumentClient.ScanOutput;  // 데이터 형식을 선언합니다.
  try {

    // 조회된 데이터를 담을 변수를 선언합니다.
    data = await dynamodb.scan({
      TableName: TABLE_TODOS,
    }).promise();

  } catch (e) {

    // 실패했을 경우에 INTERNAL_SERVER_ERROR 상태 응답입니다.
    return response(HttpStatusCode.INTERNAL_SERVER_ERROR, {
      result: false,
      message: e.toString(),
    });
  }

  // 정상 처리되었을 경우의 응답입니다.
  return response(HttpStatusCode.OK, {
    result: true,
    data,
  });
};
