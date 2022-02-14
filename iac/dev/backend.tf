terraform {
  backend "s3" {
    bucket = "ikuty-tfstate-bucket"
    key = "state/terraform.tfstate"
    region = "ap-northeast-1"
    profile = "default"
    dynamodb_table = "ikuty-tfstate-dynamodb"
  }
}
resource "aws_dynamodb_table" "terraform_state_lock" {
  name = "ikuty-tfstate-dynamodb"
  read_capacity  = 1
  write_capacity = 1
  hash_key = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}
