sam build --use-container
sam local start-api --docker-network dynamodb-local-network --env-vars local_env_vars.json