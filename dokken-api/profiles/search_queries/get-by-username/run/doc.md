# Search for profile

Searches for profile and returns results

Method: `GET`

URL: `https://dokken-api.wbagora.com/profiles/search_queries/get-by-username/run`

Params (Remove if unnecessary):

 - `limit`: `[Result count]`
 - `username`: `[Name to search]`
 - `account_fields`: `identity` (Optional)
 - `account_fields`: `presence` (Optional)
 - `account_fields`: `server_data` (Optional)
 - `account_fields`: `data` (Optional)
 - `partial_response`: `[0/1]` (Optional)
 
Headers:

 - `x-hydra-api-key`: `51586fdcbd214feb84b0e475b130fce0`
 - `x-hydra-user-agent`: `Hydra-Cpp/1.132.0`
 - `x-hydra-access-token`: `auth token/network token (delete wrong one)`
 - `Content-Type`: `application/json`

Body: `N/A`

Return: [Here](response.json)
