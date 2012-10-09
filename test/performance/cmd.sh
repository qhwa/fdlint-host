server=http://fdlint.alibaba-inc.com/
amount=5000
samual=500
ab -q \
   -n $amount -c $samual \
   -p post.txt \
   -T application/x-www-form-urlencoded \
   $server
