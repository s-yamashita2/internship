# MySQL データベース用のDockerfile
FROM mysql:8.0.44

# 設定ファイルをコピー
COPY my.cnf /etc/mysql/conf.d/my.cnf

# 設定ファイルの権限を設定
RUN chmod 644 /etc/mysql/conf.d/my.cnf

