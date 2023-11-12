# AWS SERVERLESS技術を使ってアプリを作る
## AWS準備
### 開発用のIAMユーザー作成
ルートユーザーは権限が強すぎるので、開発用のIAMユーザーを作成する
- ルートユーザーでログインして、IAMサービスに移動
- IAMユーザーを作成
- 名前とパスワードを設定
  - 本当はIAM Identity Centerを使用する？（要調査）
- ユーザーにIAMポリシーをアタッチする
  - AWSの管理ポリシーから選択
  - AdministratorAccessを使用

## lambda使ってみる
[公式のチュートリアル的なもの](https://aws.amazon.com/jp/getting-started/hands-on/run-serverless-code/)

## AWS SAM使ってみる
### AWS SAMのインストール
[AWS SAMの前提条件](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/prerequisites.html)
[AWS CLIのインストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)
- AWS Access Key & Secret Access Key
  - IAMで作成できる
[AWS SAMのインストール](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/install-sam-cli.html)
### AWS SAMのチュートリアルをやってみる
[チュートリアル: Hello World アプリケーションのデプロイ](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html#serverless-getting-started-hello-world-remote-invoke
)

#### AWS SAMのコマンド
- `sam init`
  - アプリケーションの初期化
  - 指定してアプリケーション名のディレクトリが作成される
  - アプリケーション名に"_"をつかうと上手くいかないので使わないほうが良い
- `sam build`(ローカルマシンにpythonがない場合は`sam build --use-container`を使うとdockerを使ってビルドしてくれる)
  - プロジェクトのビルド
  - .aws-samディレクトリが作成される
- `sam deploy --guided`
  - アプリケーションをAWSにデプロイする
  - Outputsにエンドポイントがある
- `sam list endpoints --output json`
  - デプロイしたアプリケーションのエンドポイントを表示してくれる
  - `curl (endpoint)`でレスポンスが返ってくるか確認できる
- `sam remote invoke (LogicalResourceId) --stack-name (アプリケーション名)`
  - クラウド内のLambda関数を呼び出し、レスポンスを返す。
- `sam sync --watch (--use-container)`
  - アプリケーションの変更を検知して、クラウドと同期する
  - 現状上手く動かない
- `sam local invoke`
  - Dockerを使って、lambda関数の呼び出しを行える（ローカルで実行できる）
  - `sam build --use-container`してから
- `sam local start-api`
  - Dockerを使って、APIエンドポイントをエミュレートするローカルHTTPサーバーを作成できる
  - `sam build --use-container`してから
- `sam delete`
  - AWSからリソースを削除できる

### AWS SAMでTypeScriptを使う
[参考](https://dev.classmethod.jp/articles/typescript-native-support-in-the-aws-sam-cli/)

### AWS SAMでdynamoDBを使ったアプリの構築(ローカル開発環境+AWSにdeploy)
[参考](https://www.ritolab.com/posts/252)

#### 補足
- `package.json`があるディレクトリで`npm install`をする
- `npm install @aws-sdk/client-dynamodb`をする
- dynamoDBにテーブルを作成しておく

#### コマンド
- `sam build --use-container`
- `sam local invoke --docker-network dynamodb-local-network --env-vars local_env_vars.json`
  - 初回だけ実行できる。その後はなぜかエラー？
- `sam local start-api --docker-network dynamodb-local-network --env-vars local_env_vars.json`
  - `curl http://127.0.0.1:3000/`
- dynamodb(local)のテーブル作成
  - `aws dynamodb create-table --table-name my-table --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --endpoint-url http://localhost:8000`

## TODO
- IAM Identity Centerを使用する

## 参考資料
[sam使ったブログ](https://dev.classmethod.jp/articles/aws-serverless-application-model/)
[serverless essential](https://pages.awscloud.com/rs/112-TZM-766/images/20200827_serverless_essential.pdf)
[dynamodb 概要](https://www.wakuwakubank.com/posts/639-aws-dynamodb-introduction/#index_id1)
[dynamodb javascript](https://maku.blog/p/5mv5dkt/)
[samについて](https://pages.awscloud.com/rs/112-TZM-766/images/20221124_24th_ISV_DiveDeepSeminar_LambdaESbuild.pdf)
[samについて2](https://d1.awsstatic.com/webinars/jp/pdf/services/20190814_AWS-Blackbelt_SAM_rev.pdf)