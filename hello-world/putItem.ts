import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import crypto from 'crypto'

const client = new DynamoDBClient({
    region: 'ap-northeast-1',
    endpoint: process.env.DDB_ENDPOINT !== '' ? process.env.DDB_ENDPOINT : undefined,
})

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = crypto.randomUUID()
        const timestamp = Date.now().toString()

        const input = {
            TableName: 'my-table',
            Item: {
                id: {
                    S: id,
                },
                timestamp: {
                    S: timestamp,
                },
            },
        }

        const command = new PutItemCommand(input)
        const response = await client.send(command)

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'success',
            }),
        }
    } catch (err) {
        console.error(err)
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'some error happened',
            }),
        }
    }
}