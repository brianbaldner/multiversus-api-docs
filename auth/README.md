# API Authentication

Getting authentication is the most confusing part of the api. It is unclear how to use every platform to log in, and unless you use Fiddler, you have to use your Steam credentials to log in ( I recommend linking a Steam account to your profile if you haven’t). This file will give an overview of all of the steps and each folder (Step 1/2/3) will show syntax and more info.

## Step 1.
Although this is step 1, this might be the only step you need. Unless you are trying to access prod-network, you only need the token from this request. For this request, you need a Steam encrypted access ticket, which you can get here. You use this in the body to get 2 auth tokens, “token” and “network_token”. “Token” is used with the dokken-api, and “network_token” is used to get a token that can be used with the prod-network. If you need to use the prod-network, proceed to step 2.

## Step 2.
This is how you get the token for the prod-network, which is mostly used with the friends list. Use the network_token from step 1, and insert it into the body (see the step 2 doc). This returns a token that can be used with the prod-network.
