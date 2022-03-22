resource "aws_lambda_function" "main" {
  lifecycle {
    ignore_changes = all
  }
  filename =  "./src.zip"
  function_name = "myStockLambdaFunction"
  role = aws_iam_role.iam_for_lambda.arn
  handler = "src/index.handler"
  runtime = "nodejs12.x"
  timeout = 10
}

resource "aws_lambda_function" "edinetCodeFunction" {
  lifecycle {
    ignore_changes = all
  }
  filename =  "./src.zip"
  function_name = "edinetCodeFunction"
  role = aws_iam_role.iam_for_lambda.arn
  handler = "src/index.handler"
  runtime = "nodejs12.x"
  timeout = 10
}

