# renomeie este arquivo para 'aws_commit.sh'

scp -i "token.pem" -rp /sindcelma-api/server ec2-user@server.amazonaws.com:~/sindcelma-api
