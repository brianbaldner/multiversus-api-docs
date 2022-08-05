# Show Leaderboards

Shows top leaderboard

Method: `GET`

URL: `https://dokken-api.wbagora.com/leaderboards/[1v1/2v2]/show`

Params (Remove if unnecessary):

 - `count`: `[int]`
 - `account_fields`: `identity` (Optional)
 - `account_fields`: `presence`(Optional)
 - `account_fields`: `data` (Optional)
 - `account_fields`: `server_data` (Optional)
 - `fields`: `server_data.2v2shuffle.0.topRating` (Optional)
 - `fields`: `server_data.1v1shuffle.0.topRating` (Optional)
 - `partial_response`: `[0/1]` (Optional)
 
Headers:

 - `x-hydra-api-key`: `51586fdcbd214feb84b0e475b130fce0`
 - `x-hydra-user-agent`: `Hydra-Cpp/1.132.0`
 - `x-hydra-access-token`: `[network token]`
 - `Content-Type`: `application/json`

Body: `N/A`

Return: [Here](response.json)
