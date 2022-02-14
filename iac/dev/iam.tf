resource "aws_iam_role" "iam_for_lambda" {
  name = "role_for_lambda"
  assume_role_policy = jsonencode({
  Version = "2012-10-17"
  Statement = [
    {
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    },
  ]
  })
  tags =  {
    tag-key = "tag-value"
  }
}

