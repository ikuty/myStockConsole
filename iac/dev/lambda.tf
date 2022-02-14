resource "aws_lambda_function" "main" {
  lifecycle {
    ignore_changes = all
  }
  filename =  "./src.zip"
  function_name = "myStockLambdaFunction"
  role = aws_iam_role.iam_for_lambda.arn
  handler = "src/index.handler"
  runtime = "nodejs12.x"
}
