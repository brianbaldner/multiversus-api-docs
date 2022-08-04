# Step 1.

See the README.md in the prev directory for more info.

Method: `POST`  
URL: `https://dokken-api.wbagora.com/access`  
Headers:
 - `x-hydra-api-key`: `51586fdcbd214feb84b0e475b130fce0`
 - `x-hydra-user-agent`: `Hydra-Cpp/1.132.0`
 - `x-hydra-client-id`: `47201f31-a35f-498a-ae5b-e9915ecb411e`
 - `Content-Type`: `application/json`

Body: `{
    “auth”: {
        “fail_on_missing”: true,
        “steam”: “[Steam encrypted key]”
    },
    “options”: [
        “wb_network”
    ]
}`

Return: [Here](response.json)