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

resource "aws_iam_policy" "policy_for_dynamodb" {
  name = "policy_for_dynamodb"
  description = "Access Dynamodb from Lambda policy"
  policy =  <<-EOT
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": "dynamodb:*",
          "Resource": "${aws_dynamodb_table.irbank-page-caches.arn}"
        }
      ]
    }
  EOT
}

resource "aws_iam_policy_attachment" "dynamodb_policy_attach_to_lambda" {
  name       = "dynamodb_policy_attach_to_lambda"
  roles      = [aws_iam_role.iam_for_lambda.name]
  policy_arn = aws_iam_policy.policy_for_dynamodb.arn
}

resource "aws_iam_policy" "policy_for_dynamodb_edinetcodes" {
  name = "policy_for_dynamodb_edinetcodes"
  description = "Access Dynamodb from Lambda policy"
  policy =  <<-EOT
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": "dynamodb:*",
          "Resource": "${aws_dynamodb_table.edinet-codes.arn}"
        }
      ]
    }
  EOT
}

resource "aws_iam_policy_attachment" "dynamodb_policy_attach_to_lambda_edinetcodes" {
  name       = "dynamodb_policy_attach_to_lambda_edinetcodes"
  roles      = [aws_iam_role.iam_for_lambda.name]
  policy_arn = aws_iam_policy.policy_for_dynamodb_edinetcodes.arn
}

