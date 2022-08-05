# Batch Request

Complete multiple requests at once. Make sure to only use the path.

Method: `PUT`

URL: `https://dokken-api.wbagora.com/batch`
 
Headers:

 - `x-hydra-api-key`: `51586fdcbd214feb84b0e475b130fce0`
 - `x-hydra-user-agent`: `Hydra-Cpp/1.132.0`
 - `x-hydra-access-token`: `[network token]`
 - `Content-Type`: `application/json`

Body: 
`{
  "options": {},
  "requests": [
    {
      "headers": {},
      "url": "[url path]",
      "verb": "[fetch method]"
    }
  ]
}`

Return: [Here](response.json)
