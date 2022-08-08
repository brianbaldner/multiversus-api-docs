# Friend Request

Sends a friend request

Method: `POST`

URL: `https://prod-network-api.wbagora.com/friends/me/invitations`


Headers:

 - `x-hydra-api-key`: `a9019bc4eed048e7bfcb3172756c291e`
 - `x-hydra-user-agent`: `Hydra-Cpp/1.132.0`
 - `x-hydra-access-token`: `auth token`
 - `Content-Type`: `application/json`

Body: `{ "account_id": "[Public id of recipient]"}`

Return: [Here](response.json)