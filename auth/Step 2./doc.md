# Step 2.

See the README.md in the prev directory for more info.

Method: `POST`  
URL: `https://prod-network-api.wbagora.com/sessions/auth/token`  
Headers:
 - `x-hydra-api-key`: `51586fdcbd214feb84b0e475b130fce0`
 - `x-hydra-user-agent`: `Hydra-Cpp/1.132.0`
 - `Content-Type`: `application/json`

Body: `{
	“code”: “[network_token from step 1]“,
	“grant_type”: “authorization_code”
}`

Return: [Here](response.json)