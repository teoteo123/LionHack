# The private key and address of the first bidder.
# Swap these into program.json, when running transactions as the first bidder.
# "private_key": "APrivateKey1zkpG9Af9z5Ha4ejVyMCqVFXRKknSm8L1ELEwcc4htk9YhVK"
# "address": aleo1yzlta2q5h8t0fqe0v6dyh9mtv4aggd53fgzr068jvplqhvqsnvzq7pj2ke

# The private key and address of the second bidder.
# Swap these into program.json, when running transactions as the second bidder.
# "private_key": "APrivateKey1zkpAFshdsj2EqQzXh5zHceDapFWVCwR6wMCJFfkLYRKupug"
# "address": aleo1esqchvevwn7n5p84e735w4dtwt2hdtu4dpguwgwy94tsxm2p7qpqmlrta4

# The private key and address of the auctioneer.
# Swap these into program.json, when running transactions as the auctioneer.
# "private_key": "APrivateKey1zkp5wvamYgK3WCAdpBQxZqQX8XnuN2u11Y6QprZTriVwZVc",
# "address": "aleo1fxs9s0w97lmkwlcmgn0z3nuxufdee5yck9wqrs0umevp7qs0sg9q5xxxzh"
if [ $1 == "b0" ]; then
echo "{
  \"program\": \"auction.aleo\",
  \"version\": \"0.0.0\",
  \"description\": \"\",
  \"development\": {
      \"private_key\": \"APrivateKey1zkpG9Af9z5Ha4ejVyMCqVFXRKknSm8L1ELEwcc4htk9YhVK\",
      \"address\": \"aleo1yzlta2q5h8t0fqe0v6dyh9mtv4aggd53fgzr068jvplqhvqsnvzq7pj2ke\"
  },
  \"license\": \"MIT\"
}" > program.json
elif [ $1 == "b1" ]; then
echo "{
  \"program\": \"auction.aleo\",
  \"version\": \"0.0.0\",
  \"description\": \"\",
  \"development\": {
      \"private_key\": \"APrivateKey1zkpAFshdsj2EqQzXh5zHceDapFWVCwR6wMCJFfkLYRKupug\",
      \"address\": \"aleo1esqchvevwn7n5p84e735w4dtwt2hdtu4dpguwgwy94tsxm2p7qpqmlrta4\"
  },
  \"license\": \"MIT\"
}" > program.json
elif [ $1 == "b2" ]; then
echo "{
  \"program\": \"auction.aleo\",
  \"version\": \"0.0.0\",
  \"description\": \"\",
  \"development\": {
      \"private_key\": \"APrivateKey1zkp9Ghs6YtJF7rBzpqdtt2mbkEomfTtfUpk5wniaAcjJ1Pa\",
      \"address\": \"aleo18fyk2hzy7fxh7tkwu2m274jcmu4l7ftd8uvp8cwc2y24frzsggyq44hcc9\"
  },
  \"license\": \"MIT\"
}" > program.json
elif [ $1 == "auctioneer" ]; then
echo "{
  \"program\": \"auction.aleo\",
  \"version\": \"0.0.0\",
  \"description\": \"\",
  \"development\": {
      \"private_key\": \"APrivateKey1zkp5wvamYgK3WCAdpBQxZqQX8XnuN2u11Y6QprZTriVwZVc\",
      \"address\": \"aleo1fxs9s0w97lmkwlcmgn0z3nuxufdee5yck9wqrs0umevp7qs0sg9q5xxxzh\"
  },
  \"license\": \"MIT\"
}" > program.json
else 
echo "Failed"
exit 1
fi