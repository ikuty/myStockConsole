resource "aws_dynamodb_table" "irbank-page-caches" {
  name = "irbank-page-caches"
  billing_mode = "PROVISIONED"
  read_capacity = 1
  write_capacity = 1
  hash_key = "url"

  attribute {
    name = "url"
    type = "S"
  }
}
resource "aws_dynamodb_table" "edinet-codes" {
  name = "edinet-codes"
  billing_mode = "PROVISIONED"
  read_capacity = 1
  write_capacity = 1
  hash_key = "security_code"

  attribute {
    name = "security_code"
    type = "N"
  }
}

