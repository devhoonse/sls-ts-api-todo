
// import : 3rd-parties
import { APIGatewayProxyResult } from "aws-lambda";

// import : user-defined modules
import HttpStatusCode from "./httpStatusCode";


/*
 * 클라이언트로 전달할 응답을 구성하여 반환합니다.
 */
const response = (status: HttpStatusCode, data: IResponseBody): APIGatewayProxyResult => {
  return {
    statusCode: status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
};


// export
export { response };
