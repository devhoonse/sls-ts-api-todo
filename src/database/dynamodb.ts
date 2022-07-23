
// import : 3rd-parties
import * as AWS from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";


// 환경 변수로부터 값을 읽어옵니다.
const DB_PREFIX = process.env.DB_PREFIX;    // 환경 변수에 설정된 DB_PREFIX 값 : serverless.ts 참고
const TABLE_TODOS = `${DB_PREFIX}_todos`;   // 할 일 목록 테이블 : serverless.ts 참고


// 현재 로컬 환경에서 오프라인으로 열린 서버리스일 때 사용할 DynamoDB 접속 정보입니다.
const dynamodbOfflineOptions: ServiceConfigurationOptions = {
  endpoint: "http://localhost:8000",
};


// 현재 로컬 환경에서 오프라인으로 열린 서버리스인지를 확인합니다.
const isOffline = () => process.env.NODE_DEV === "dev";


// DynamoDB 클라이언트를 생성합니다.
const dynamodb: AWS.DynamoDB.DocumentClient = isOffline()
  ? new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions)
  : new AWS.DynamoDB.DocumentClient();


// export
export { dynamodb, DB_PREFIX, TABLE_TODOS };
